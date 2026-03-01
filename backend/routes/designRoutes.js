import express from 'express';
import { getDesigns, getDesignById, createDesign, updateDesign, deleteDesign } from '../controllers/designController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getDesigns).post(protect, createDesign);
router.route('/:id').get(protect, getDesignById).put(protect, updateDesign).delete(protect, deleteDesign);

export default router;