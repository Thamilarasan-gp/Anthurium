import { Request, Response } from 'express';
import { Story } from '../models/Story';

export const getStories = async (req: Request, res: Response): Promise<void> => {
  try {
    const stories = await Story.find({ isActive: true })
      .populate({
        path: 'linkedProducts',
        populate: { path: 'category', select: 'name slug' }
      })
      .sort({ displayOrder: 1, createdAt: -1 });

    res.json({ success: true, count: stories.length, stories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching Instagram stories' });
  }
};

export const createStory = async (req: Request, res: Response): Promise<void> => {
  try {
    const story = await Story.create(req.body);
    res.status(201).json({ success: true, message: 'Story created successfully', story });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error creating story' });
  }
};

export const updateStory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const story = await Story.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!story) {
      res.status(404).json({ success: false, message: 'Story not found' });
      return;
    }

    res.json({ success: true, message: 'Story updated successfully', story });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error updating story' });
  }
};

export const deleteStory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const story = await Story.findByIdAndDelete(id);

    if (!story) {
      res.status(404).json({ success: false, message: 'Story not found' });
      return;
    }

    res.json({ success: true, message: 'Story deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error deleting story' });
  }
};
