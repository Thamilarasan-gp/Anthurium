import { Router } from 'express';
import {
  getBanners,
  getAllBannersAdmin,
  createBanner,
  updateBanner,
  deleteBanner
} from '../controllers/bannerController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getBanners);
router.get('/admin/all', protect, adminOnly, getAllBannersAdmin);
router.post('/', protect, adminOnly, createBanner);
router.put('/:id', protect, adminOnly, updateBanner);
router.delete('/:id', protect, adminOnly, deleteBanner);

export default router;
