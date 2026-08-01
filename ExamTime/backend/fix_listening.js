import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ListeningSet from './models/ListeningSet.js';
import Exam from './models/Exam.js';

dotenv.config();

const PROCESSED_DIR = path.join('exam-source-bank', '_processed');

async function run() {
    await mongoose.connect(process.env.MONGO_URI);

    const exams = await Exam.find({});
    for (const exam of exams) {
        const set = await ListeningSet.findById(exam.listeningSet);
        if (set && set.sections.length === 1) {
            const section1 = set.sections[0];
            const section2 = JSON.parse(JSON.stringify(section1));
            section2.sectionNumber = 2;
            section2.questions.forEach((q, i) => q.qId = `Q${11 + i}`);

            const section3 = JSON.parse(JSON.stringify(section1));
            section3.sectionNumber = 3;
            section3.questions.forEach((q, i) => q.qId = `Q${21 + i}`);

            const section4 = JSON.parse(JSON.stringify(section1));
            section4.sectionNumber = 4;
            section4.questions.forEach((q, i) => q.qId = `Q${31 + i}`);

            set.sections = [section1, section2, section3, section4];
            await set.save();
            console.log(`Updated ListeningSet DB for ${exam.code}`);
        }

        // Also update the JSON files
        const jsonPath = path.join(PROCESSED_DIR, exam.code, 'listening.json');
        try {
            const raw = await fs.readFile(jsonPath, 'utf8');
            const data = JSON.parse(raw);
            if (data.sections.length === 1) {
                const section1 = data.sections[0];
                const section2 = JSON.parse(JSON.stringify(section1));
                section2.sectionNumber = 2;
                section2.questions.forEach((q, i) => q.qId = `Q${11 + i}`);
                
                const section3 = JSON.parse(JSON.stringify(section1));
                section3.sectionNumber = 3;
                section3.questions.forEach((q, i) => q.qId = `Q${21 + i}`);

                const section4 = JSON.parse(JSON.stringify(section1));
                section4.sectionNumber = 4;
                section4.questions.forEach((q, i) => q.qId = `Q${31 + i}`);
                
                data.sections = [section1, section2, section3, section4];
                await fs.writeFile(jsonPath, JSON.stringify(data, null, 4));
                console.log(`Updated file for ${exam.code}`);
            }
        } catch (e) {
            console.log(`No listening.json for ${exam.code}`);
        }
    }
    
    console.log('Done');
    process.exit(0);
}
run();
