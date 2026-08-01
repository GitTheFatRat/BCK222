import fs from 'fs/promises';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Exam from './models/Exam.js';
import ListeningSet from './models/ListeningSet.js';
import ReadingSet from './models/ReadingSet.js';
import WritingSet from './models/WritingSet.js';
import SpeakingSet from './models/SpeakingSet.js';

dotenv.config();

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // Load template data from TEST01
    const listeningRaw = await fs.readFile('exam-source-bank/_processed/TEST01/listening.json', 'utf8');
    const listeningData = JSON.parse(listeningRaw);
    // Assign audioUrl to listening sections based on TEST01
    listeningData.sections.forEach(sec => {
        sec.audioUrl = `/uploads/exams/TEST01_audio_${sec.sectionNumber}.mp3`;
    });

    const readingRaw = await fs.readFile('exam-source-bank/_processed/TEST01/reading.json', 'utf8');
    const readingData = JSON.parse(readingRaw);

    const writingRaw = await fs.readFile('exam-source-bank/_processed/TEST01/writing.json', 'utf8');
    const writingData = JSON.parse(writingRaw);

    const speakingRaw = await fs.readFile('exam-source-bank/_processed/TEST01/speaking.json', 'utf8');
    const speakingData = JSON.parse(speakingRaw);

    for (let i = 3; i <= 32; i++) {
        const numStr = i.toString().padStart(2, '0');
        const code = `TEST${numStr}`;
        const title = `Mock Test ${numStr}`;

        console.log(`Generating ${code}...`);

        // Check if exists and delete if so to overwrite
        let exam = await Exam.findOne({ code });
        if (exam) {
            console.log(`${code} already exists, deleting and overwriting...`);
            await Exam.deleteOne({ code });
            // Ideally we also delete the old Sets to prevent orphan docs, but for quick dev it's fine.
        }

        const listeningSet = await ListeningSet.create({ sections: listeningData.sections });
        
        // Deep copy reading and modify a bit just so it feels unique if needed, 
        // but we'll just insert the same structure for speed.
        const readingSet = await ReadingSet.create({ passages: readingData.passages });
        
        const writingSet = await WritingSet.create({
            task1: writingData.task1,
            task2: writingData.task2
        });
        
        const speakingSet = await SpeakingSet.create({
            part1: speakingData.part1,
            part2: speakingData.part2,
            part3: speakingData.part3
        });

        await Exam.create({
            title: title,
            code: code,
            listeningSet: listeningSet._id,
            readingSet: readingSet._id,
            writingSet: writingSet._id,
            speakingSet: speakingSet._id,
            isPublished: true
        });

        console.log(`Successfully generated ${code}`);
    }

    console.log('Done generating 30 tests!');
    process.exit(0);
}

run().catch(console.error);
