import { Router } from 'express';
import { getWishlist, toggleWishlistItem, removeFromWishlist } from '../controllers/wishlistController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect, getWishlist);
router.post('/toggle', protect, toggleWishlistItem);
router.delete('/:productId', protect, removeFromWishlist);

export default router;
