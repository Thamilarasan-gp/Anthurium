import { Router } from 'express';
import { uploadImage, uploadAudio, uploadMedia } from '../controllers/uploadController';

const router = Router();

// Allow image & audio uploads (directly stored to Cloudinary)
router.post('/', uploadMedia);
router.post('/image', uploadImage);
router.post('/audio', uploadAudio);

export default router;
