import { Response } from 'express';
import { Wishlist } from '../models/Wishlist';
import { AuthRequest } from '../middleware/authMiddleware';

export const getWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products',
      populate: { path: 'category', select: 'name slug' }
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.json({ success: true, wishlist: wishlist.products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching wishlist' });
  }
};

export const toggleWishlistItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { productId } = req.body;
    if (!productId) {
      res.status(400).json({ success: false, message: 'productId is required' });
      return;
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    const index = wishlist.products.findIndex((p) => p.toString() === productId);
    let added = false;

    if (index > -1) {
      wishlist.products.splice(index, 1);
    } else {
      wishlist.products.push(productId as any);
      added = true;
    }

    await wishlist.save();

    const updatedWishlist = await Wishlist.findById(wishlist._id).populate({
      path: 'products',
      populate: { path: 'category', select: 'name slug' }
    });

    res.json({
      success: true,
      message: added ? 'Added to wishlist' : 'Removed from wishlist',
      added,
      wishlist: updatedWishlist?.products || []
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating wishlist' });
  }
};

export const removeFromWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);
      await wishlist.save();
    }

    const updatedWishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products',
      populate: { path: 'category', select: 'name slug' }
    });

    res.json({
      success: true,
      message: 'Item removed from wishlist',
      wishlist: updatedWishlist?.products || []
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error removing from wishlist' });
  }
};
