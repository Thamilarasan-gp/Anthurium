import { Request, Response } from 'express';
import { Review } from '../models/Review';
import { Product } from '../models/Product';
import { AuthRequest } from '../middleware/authMiddleware';

export const getProductReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId, status: 'approved' }).sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching reviews' });
  }
};

export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, rating, title, comment, customerName, images } = req.body;

    if (!productId || !rating || !comment) {
      res.status(400).json({ success: false, message: 'ProductId, rating, and comment are required' });
      return;
    }

    const review = await Review.create({
      product: productId,
      user: req.user ? req.user._id : undefined,
      customerName: customerName || (req.user ? req.user.name : 'Anonymous Customer'),
      rating: Number(rating),
      title,
      comment,
      images,
      status: 'approved'
    });

    // Update Product average rating
    const allReviews = await Review.find({ product: productId, status: 'approved' });
    const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;

    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      numReviews: allReviews.length
    });

    res.status(201).json({ success: true, message: 'Review submitted successfully', review });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error submitting review' });
  }
};

export const getAllReviewsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await Review.find().populate('product', 'title slug images').sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching admin reviews' });
  }
};

export const updateReviewStatusAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, featured } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      res.status(404).json({ success: false, message: 'Review not found' });
      return;
    }

    if (status) review.status = status;
    if (typeof featured === 'boolean') review.featured = featured;

    await review.save();

    res.json({ success: true, message: 'Review updated successfully', review });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating review' });
  }
};

export const deleteReviewAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      res.status(404).json({ success: false, message: 'Review not found' });
      return;
    }
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error deleting review' });
  }
};

