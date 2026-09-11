import { Router } from 'express';
import {
  getProductReviews,
  createReview,
  getAllReviewsAdmin,
  updateReviewStatusAdmin
} from '../controllers/reviewController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.get('/product/:productId', getProductReviews);
router.post('/', createReview);
router.get('/admin/all', protect, adminOnly, getAllReviewsAdmin);
router.put('/admin/:id', protect, adminOnly, updateReviewStatusAdmin);

export default router;
