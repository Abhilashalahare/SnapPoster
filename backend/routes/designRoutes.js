import express from 'express';
import { getDesigns, getDesignById, createDesign, updateDesign, deleteDesign } from '../controllers/designController.js';

const router = express.Router();

// The doors are 100% open. No security middleware here!
router.route('/')
  .get(getDesigns)
  .post(createDesign);

router.route('/:id')
  .get(getDesignById)
  .put(updateDesign)
  .delete(deleteDesign);

export default router;