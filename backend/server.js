import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import designRoutes from './routes/designRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
// Increased limit for large canvas JSON data
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => res.send('Poster Maker API is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));