import { Request, Response } from 'express';
import { Collection } from '../models/Collection';

export const getCollections = async (req: Request, res: Response): Promise<void> => {
  try {
    const collections = await Collection.find().sort({ displayOrder: 1, title: 1 });
    res.json({ success: true, count: collections.length, collections });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching collections' });
  }
};

export const getCollectionBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const collection = await Collection.findOne({ slug });

    if (!collection) {
      res.status(404).json({ success: false, message: 'Collection not found' });
      return;
    }

    res.json({ success: true, collection });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching collection' });
  }
};

export const createCollection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, slug, description, bannerImage, displayOrder, featured } = req.body;
    const colSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const collection = await Collection.create({
      title,
      slug: colSlug,
      description,
      bannerImage,
      displayOrder: displayOrder || 0,
      featured: featured || false
    });

    res.status(201).json({ success: true, message: 'Collection created successfully', collection });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error creating collection' });
  }
};

export const updateCollection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const collection = await Collection.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!collection) {
      res.status(404).json({ success: false, message: 'Collection not found' });
      return;
    }

    res.json({ success: true, message: 'Collection updated successfully', collection });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error updating collection' });
  }
};

export const deleteCollection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const collection = await Collection.findByIdAndDelete(id);

    if (!collection) {
      res.status(404).json({ success: false, message: 'Collection not found' });
      return;
    }

    res.json({ success: true, message: 'Collection deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error deleting collection' });
  }
};
