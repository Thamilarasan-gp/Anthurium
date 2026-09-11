import { Router } from 'express';
import {
  validateCoupon,
  getAllCouponsAdmin,
  createCouponAdmin,
  updateCouponAdmin,
  deleteCouponAdmin
} from '../controllers/couponController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.post('/validate', validateCoupon);
router.get('/admin/all', protect, adminOnly, getAllCouponsAdmin);
router.post('/admin', protect, adminOnly, createCouponAdmin);
router.put('/admin/:id', protect, adminOnly, updateCouponAdmin);
router.delete('/admin/:id', protect, adminOnly, deleteCouponAdmin);

export default router;
