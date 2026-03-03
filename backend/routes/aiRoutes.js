import express from 'express';
import { generateLayout } from '../controllers/aiController.js';

const router = express.Router();

router.post('/generate', generateLayout);

export default router;