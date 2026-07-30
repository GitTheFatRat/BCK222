import fs from 'fs/promises';
import path from 'path';

import Exam from '../models/Exam.js';
import ListeningSet from '../models/ListeningSet.js';
import ReadingSet from '../models/ReadingSet.js';
import WritingSet from '../models/WritingSet.js';
import SpeakingSet from '../models/SpeakingSet.js';

const SOURCE_BANK_DIR = 'exam-source-bank';
const PROCESSED_DIR = path.join(SOURCE_BANK_DIR, '_processed');
const FAILED_DIR = path.join(SOURCE_BANK_DIR, '_failed');
const UPLOADS_EXAMS_DIR = path.join('uploads', 'exams');

async function ensureDir(dirPath) {
    await fs.mkdir(dirPath, { recursive: true });
}

async function readJsonFile(filePath) {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
}

async function writeFailureLog(folderName, error) {
    const failedFolderPath = path.join(FAILED_DIR, folderName);
    await ensureDir(failedFolderPath);
    await fs.writeFile(
        path.join(failedFolderPath, 'error.txt'),
        `Folder: ${folderName}\nError: ${error.message}\nStack: ${error.stack}\nTime: ${new Date().toISOString()}`
    )
}

export async function ingestExamFolder(req, res) {
    const { folderName } = req.body;

    if (!folderName) {
        return res.status(400).json({ message: 'Missing folder name' });
    }

    const safeFolderName = path.basename(folderName);
    const sourcePath = path.join(SOURCE_BANK_DIR, safeFolderName);

    try {
        await fs.access(sourcePath);
    } catch (error) {
        return res.status(404).json({ message: 'Folder not found' });
    }

    try {
        const manifest = await readJsonFile(path.join(sourcePath, 'manifest.json'));
        const listeningData = await readJsonFile(path.join(sourcePath, 'listening.json'));
        const readingData = await readJsonFile(path.join(sourcePath, 'reading.json'));
        const writingData = await readJsonFile(path.join(sourcePath, 'writing.json'));
        const speakingData = await readJsonFile(path.join(sourcePath, 'speaking.json'));

        await ensureDir(UPLOADS_EXAMS_DIR);
        const audioFileName = `${manifest.code}.mp3`;
        const audioDestPath = path.join(UPLOADS_EXAMS_DIR, audioFileName);
        await fs.copyFile(path.join(sourcePath, 'audio.mp3'), audioDestPath);

        listeningData.audioUrl = `/uploads/exams/${audioFileName}`;
        const [listeningResult, readingResult, writingResult, speakingResult] = await Promise.all([
            ListeningSet.bulkWrite([{ insertOne: { document: listeningData } }]),
            ReadingSet.bulkWrite([{ insertOne: { document: readingData } }]),
            WritingSet.bulkWrite([{ insertOne: { document: writingData } }]),
            SpeakingSet.bulkWrite([{ insertOne: { document: speakingData } }]),
        ]);

        const exam = await Exam.create({
            title: manifest.title,
            code: manifest.code,
            listeningSet: listeningResult.insertedIds[0],
            readingSet: readingResult.insertedIds[0],
            writingSet: writingResult.insertedIds[0],
            speakingSet: speakingResult.insertedIds[0],
            isPublished: manifest.isPublished ?? true,
        });

        await ensureDir(PROCESSED_DIR);
        await fs.rename(sourcePath, path.join(PROCESSED_DIR, folderName));

        return res.status(201).json({
            message: `Exam ${manifest.code} ingested successfully`
        });

    } catch (error) {
        console.error('[ingestExamFolder] err:', error.message);
        await writeFailureLog(folderName, error);
        return res.status(500).json({ message: 'failed to ingest exam' });
    }
}