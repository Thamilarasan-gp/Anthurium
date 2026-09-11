import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  trackOrderByNumber,
  linkOrderToUser,
  getAllOrdersAdmin,
  updateOrderStatusAdmin
} from '../controllers/orderController';
import { protect, optionalProtect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.post('/', optionalProtect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.post('/link-order', protect, linkOrderToUser);
router.get('/track/:orderNumber', trackOrderByNumber);
router.get('/:id', getOrderById);

// Admin Routes
router.get('/admin/all', protect, adminOnly, getAllOrdersAdmin);
router.put('/admin/:id/status', protect, adminOnly, updateOrderStatusAdmin);

export default router;
