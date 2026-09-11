import { Request, Response } from 'express';
import { Mood } from '../models/Mood';

export const getMoods = async (req: Request, res: Response): Promise<void> => {
  try {
    const moods = await Mood.find({ isActive: true })
      .populate({
        path: 'products',
        populate: { path: 'category', select: 'name slug' }
      })
      .sort({ displayOrder: 1 });

    res.json({ success: true, count: moods.length, moods });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching moods' });
  }
};

export const createMood = async (req: Request, res: Response): Promise<void> => {
  try {
    const mood = await Mood.create(req.body);
    res.status(201).json({ success: true, message: 'Mood created successfully', mood });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error creating mood' });
  }
};

export const updateMood = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const mood = await Mood.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!mood) {
      res.status(404).json({ success: false, message: 'Mood not found' });
      return;
    }

    res.json({ success: true, message: 'Mood updated successfully', mood });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error updating mood' });
  }
};

export const deleteMood = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const mood = await Mood.findByIdAndDelete(id);

    if (!mood) {
      res.status(404).json({ success: false, message: 'Mood not found' });
      return;
    }

    res.json({ success: true, message: 'Mood deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error deleting mood' });
  }
};
