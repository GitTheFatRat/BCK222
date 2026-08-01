import fs from 'fs/promises';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Exam from './models/Exam.js';
import ListeningSet from './models/ListeningSet.js';
import ReadingSet from './models/ReadingSet.js';

dotenv.config();

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const exam = await Exam.findOne({ code: 'TEST02' });
    if (exam) {
        const raw = await fs.readFile('exam-source-bank/_processed/TEST02/listening.json', 'utf8');
        const data = JSON.parse(raw);
        
        for (const section of data.sections) {
            const destName = `TEST02_audio_${section.sectionNumber}.mp3`;
            const destPath = `uploads/exams/${destName}`;
            await fs.copyFile(`exam-source-bank/_processed/TEST02/audio_${section.sectionNumber}.mp3`, destPath);
            section.audioUrl = `/uploads/exams/${destName}`;
        }
        
        await ListeningSet.findByIdAndUpdate(exam.listeningSet, {
            sections: data.sections
        });
        
        const readingRaw = await fs.readFile('exam-source-bank/_processed/TEST02/reading.json', 'utf8');
        const readingData = JSON.parse(readingRaw);
        await ReadingSet.findByIdAndUpdate(exam.readingSet, {
            passages: readingData.passages
        });
        
        console.log('Successfully updated TEST02 ListeningSet and ReadingSet in DB');
    }
    process.exit(0);
}
run();
