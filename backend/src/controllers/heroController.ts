import { Request, Response } from 'express';
import { HeroSection } from '../models/HeroSection';

export const getHeroSections = async (req: Request, res: Response): Promise<void> => {
  try {
    const heroes = await HeroSection.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, count: heroes.length, heroes, heroSections: heroes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching hero sections' });
  }
};

export const getAllHeroSectionsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const heroes = await HeroSection.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, count: heroes.length, heroes, heroSections: heroes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching admin hero sections' });
  }
};

export const createHeroSection = async (req: Request, res: Response): Promise<void> => {
  try {
    const hero = await HeroSection.create(req.body);
    res.status(201).json({ success: true, message: 'Hero section created successfully', hero, heroSection: hero });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error creating hero section' });
  }
};

export const updateHeroSection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const hero = await HeroSection.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!hero) {
      res.status(404).json({ success: false, message: 'Hero section not found' });
      return;
    }

    res.json({ success: true, message: 'Hero section updated successfully', hero, heroSection: hero });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error updating hero section' });
  }
};

export const deleteHeroSection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const hero = await HeroSection.findByIdAndDelete(id);

    if (!hero) {
      res.status(404).json({ success: false, message: 'Hero section not found' });
      return;
    }

    res.json({ success: true, message: 'Hero section deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error deleting hero section' });
  }
};
