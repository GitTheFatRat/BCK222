import express from "express";
import cors from 'cors'
import dotenv from 'dotenv'

import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js'

dotenv.config()

const app = express();
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
    console.error('[GLOBAL ERROR HANDLER]', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

const PORT = process.env.PORT || 5000

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`)
    });
});