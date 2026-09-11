import { Request, Response } from 'express';
import { Banner } from '../models/Banner';

export const getBanners = async (req: Request, res: Response): Promise<void> => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, banners });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching banners' });
  }
};

export const getAllBannersAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const banners = await Banner.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, banners });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching banners' });
  }
};

export const createBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json({ success: true, banner });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error creating banner' });
  }
};

export const updateBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!banner) {
      res.status(404).json({ success: false, message: 'Banner not found' });
      return;
    }
    res.json({ success: true, banner });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating banner' });
  }
};

export const deleteBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      res.status(404).json({ success: false, message: 'Banner not found' });
      return;
    }
    res.json({ success: true, message: 'Banner deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error deleting banner' });
  }
};
