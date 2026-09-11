import { Request, Response } from 'express';
import { Lookbook } from '../models/Lookbook';

export const getLookbooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const lookbooks = await Lookbook.find({ isActive: true })
      .populate('hotspots.product')
      .sort({ displayOrder: 1, createdAt: -1 });

    res.json({ success: true, count: lookbooks.length, lookbooks });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching lookbooks' });
  }
};

export const createLookbook = async (req: Request, res: Response): Promise<void> => {
  try {
    const lookbook = await Lookbook.create(req.body);
    res.status(201).json({ success: true, message: 'Lookbook created successfully', lookbook });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error creating lookbook' });
  }
};

export const updateLookbook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const lookbook = await Lookbook.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!lookbook) {
      res.status(404).json({ success: false, message: 'Lookbook not found' });
      return;
    }

    res.json({ success: true, message: 'Lookbook updated successfully', lookbook });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error updating lookbook' });
  }
};

export const deleteLookbook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const lookbook = await Lookbook.findByIdAndDelete(id);

    if (!lookbook) {
      res.status(404).json({ success: false, message: 'Lookbook not found' });
      return;
    }

    res.json({ success: true, message: 'Lookbook deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error deleting lookbook' });
  }
};
