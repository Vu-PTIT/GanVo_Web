import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadImage } from '../controllers/uploadController.js';

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/'); // Ensure this path matches where you want to store
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file ảnh'));
        }
    }
});

router.post('/', upload.single('file'), uploadImage);

export default router;
