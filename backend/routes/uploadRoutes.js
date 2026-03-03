import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Give Cloudinary your "keys"
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();

// Configure Multer
const upload = multer({ storage: multer.memoryStorage() });

// The unlocked upload route
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'newresolutionstudio_posters' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Error:', error);
          return res.status(500).json({ message: 'Cloudinary upload failed' });
        }
        res.status(200).json({ url: result.secure_url });
      }
    );

    uploadStream.end(req.file.buffer);

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

export default router;