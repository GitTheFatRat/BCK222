import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import Exam from './models/Exam.js';
import ListeningSet from './models/ListeningSet.js';
import ReadingSet from './models/ReadingSet.js';
import WritingSet from './models/WritingSet.js';
import SpeakingSet from './models/SpeakingSet.js';

dotenv.config();

const SOURCE_BANK_DIR = 'exam-source-bank';
const PROCESSED_DIR = path.join(SOURCE_BANK_DIR, '_processed');
const UPLOADS_EXAMS_DIR = path.join('uploads', 'exams');

async function readJsonFile(filePath) {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
}

async function writeJsonFile(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 4));
}

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // 1. Rename existing
        const oldCode = 'CAMBRIDGE-19-TEST01';
        const newCode = 'TEST01';
        
        const existingExam = await Exam.findOne({ code: oldCode });
        if (existingExam) {
            existingExam.code = newCode;
            existingExam.title = 'Test 01';
            await existingExam.save();
            
            // Rename audio in uploads
            const oldAudioPath = path.join(UPLOADS_EXAMS_DIR, `${oldCode}.mp3`);
            const newAudioPath = path.join(UPLOADS_EXAMS_DIR, `${newCode}.mp3`);
            try {
                await fs.rename(oldAudioPath, newAudioPath);
                // update ListeningSet audioUrl
                await ListeningSet.findByIdAndUpdate(existingExam.listeningSet, {
                    audioUrl: `/uploads/exams/${newCode}.mp3`
                });
            } catch (e) {
                console.log('Audio rename skip or error', e.message);
            }

            // Rename folder in _processed
            const oldFolderPath = path.join(PROCESSED_DIR, oldCode);
            const newFolderPath = path.join(PROCESSED_DIR, newCode);
            try {
                await fs.rename(oldFolderPath, newFolderPath);
                // Update manifest
                const manifestPath = path.join(newFolderPath, 'manifest.json');
                const manifest = await readJsonFile(manifestPath);
                manifest.code = newCode;
                manifest.title = 'Test 01';
                await writeJsonFile(manifestPath, manifest);
            } catch(e) {
                 console.log('Folder rename skip or error', e.message);
            }
            console.log('Renamed existing exam to TEST01');
        }

        // 2. Read base JSONs from TEST01
        const baseFolderPath = path.join(PROCESSED_DIR, 'TEST01');
        const listeningData = await readJsonFile(path.join(baseFolderPath, 'listening.json'));
        const readingData = await readJsonFile(path.join(baseFolderPath, 'reading.json'));
        const writingData = await readJsonFile(path.join(baseFolderPath, 'writing.json'));
        const speakingData = await readJsonFile(path.join(baseFolderPath, 'speaking.json'));

        // 3. Generate 9 more tests
        for (let i = 2; i <= 10; i++) {
            const testId = `TEST${String(i).padStart(2, '0')}`;
            const testTitle = `Test ${String(i).padStart(2, '0')}`;
            console.log(`Generating ${testId}...`);

            // Check if exists
            const exists = await Exam.findOne({ code: testId });
            if (exists) {
                console.log(`${testId} already exists, skipping.`);
                continue;
            }

            // Copy audio
            const baseAudio = path.join(UPLOADS_EXAMS_DIR, 'TEST01.mp3');
            const newAudio = path.join(UPLOADS_EXAMS_DIR, `${testId}.mp3`);
            try {
                await fs.copyFile(baseAudio, newAudio);
            } catch (e) {
                // Ignore if audio missing
            }

            // Insert Sets
            const newListeningData = { ...listeningData, audioUrl: `/uploads/exams/${testId}.mp3` };
            // Remove _id if present from base data
            delete newListeningData._id;
            const newReadingData = { ...readingData }; delete newReadingData._id;
            const newWritingData = { ...writingData }; delete newWritingData._id;
            const newSpeakingData = { ...speakingData }; delete newSpeakingData._id;

            const [listRes, readRes, writRes, speakRes] = await Promise.all([
                ListeningSet.bulkWrite([{ insertOne: { document: newListeningData } }]),
                ReadingSet.bulkWrite([{ insertOne: { document: newReadingData } }]),
                WritingSet.bulkWrite([{ insertOne: { document: newWritingData } }]),
                SpeakingSet.bulkWrite([{ insertOne: { document: newSpeakingData } }])
            ]);

            // Create Exam
            await Exam.create({
                title: testTitle,
                code: testId,
                listeningSet: listRes.insertedIds[0],
                readingSet: readRes.insertedIds[0],
                writingSet: writRes.insertedIds[0],
                speakingSet: speakRes.insertedIds[0],
                isPublished: true,
            });

            // Create folder in _processed
            const newFolder = path.join(PROCESSED_DIR, testId);
            await fs.mkdir(newFolder, { recursive: true });
            await writeJsonFile(path.join(newFolder, 'manifest.json'), { title: testTitle, code: testId, isPublished: true });
            await writeJsonFile(path.join(newFolder, 'listening.json'), newListeningData);
            await writeJsonFile(path.join(newFolder, 'reading.json'), newReadingData);
            await writeJsonFile(path.join(newFolder, 'writing.json'), newWritingData);
            await writeJsonFile(path.join(newFolder, 'speaking.json'), newSpeakingData);
            
            // Also copy the audio to the processed folder
            try {
                await fs.copyFile(path.join(baseFolderPath, 'audio.mp3'), path.join(newFolder, 'audio.mp3'));
            } catch (e) {}

            console.log(`Successfully added ${testId}`);
        }

        console.log('All done!');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

run();
