import { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';

// Ensure Cloudinary is configured with credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'jrpuc4bx',
  api_key: process.env.CLOUDINARY_API_KEY || '554883776315955',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'zPaUz2taw5TYvC7e7AUpx96C3bc'
});

export const uploadMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body.audio || req.body.image || req.body.file || req.body.media;
    const isAudio = !!req.body.audio || (typeof data === 'string' && data.startsWith('data:audio/'));
    const folder = req.body.folder || (isAudio ? 'anthurium/audio' : 'anthurium');

    if (!data) {
      res.status(400).json({ success: false, message: 'No media/file data provided' });
      return;
    }

    // If it's already an online URL (http/https), return it directly
    if (typeof data === 'string' && (data.startsWith('http://') || data.startsWith('https://'))) {
      res.json({ success: true, url: data, provider: 'url' });
      return;
    }

    // Refresh Cloudinary config
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'jrpuc4bx',
      api_key: process.env.CLOUDINARY_API_KEY || '554883776315955',
      api_secret: process.env.CLOUDINARY_API_SECRET || 'zPaUz2taw5TYvC7e7AUpx96C3bc'
    });

    // Upload to Cloudinary with resource_type: auto (handles audio, video, images)
    const uploadResult = await cloudinary.uploader.upload(data, {
      folder,
      resource_type: 'auto'
    });

    if (!uploadResult || !uploadResult.secure_url) {
      res.status(500).json({ success: false, message: 'Cloudinary did not return a secure URL' });
      return;
    }

    console.log(`✅ ${isAudio ? 'Audio' : 'Media'} uploaded successfully to Cloudinary:`, uploadResult.secure_url);

    res.json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      resource_type: uploadResult.resource_type,
      provider: 'cloudinary'
    });
  } catch (error: any) {
    console.error('❌ Cloudinary media upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload media to Cloudinary'
    });
  }
};

export const uploadImage = uploadMedia;
export const uploadAudio = uploadMedia;
