import { Router } from 'express';
import { createRazorpayOrder, verifyPayment } from '../controllers/paymentController';

const router = Router();

router.post('/razorpay/create-order', createRazorpayOrder);
router.post('/razorpay/verify', verifyPayment);

export default router;
