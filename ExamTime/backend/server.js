import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';

import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import examRoutes from './routes/examRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import resultRoutes from './routes/resultRoutes.js';

dotenv.config();
fs.mkdirSync('uploads/exams', { recursive: true });
fs.mkdirSync('uploads/speaking', { recursive: true });
fs.mkdirSync('uploads/writing', { recursive: true });

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/results', resultRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
    console.error('[Global Error Handler]', err);
    res.status(err.status || 500).json({ message: err.message || 'Loi server noi bo.' });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`[ExamTime Backend] Dang chay tai http://localhost:${PORT}`);
    });
});