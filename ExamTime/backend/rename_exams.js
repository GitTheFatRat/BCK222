import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Exam from './models/Exam.js';

dotenv.config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const exams = await Exam.find({});
        let count = 0;
        for (const exam of exams) {
            if (exam.title.startsWith('Mock ')) {
                exam.title = exam.title.replace('Mock ', '');
                await exam.save();
                count++;
            }
        }

        console.log(`Updated ${count} exams.`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit(0);
    }
}

run();
