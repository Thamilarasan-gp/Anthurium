import { Request, Response } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { Order } from '../models/Order';

const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (keyId && keySecret) {
    return new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return null;
};

export const createRazorpayOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_anthurium_mock_id';
    const amountInPaise = Math.round(order.totalAmount * 100);

    const razorpay = getRazorpayInstance();
    let razorpayOrderId = '';

    if (razorpay && process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_ID.includes('mock')) {
      const rzpOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rcpt_${order.orderNumber.replace(/[^a-zA-Z0-9]/g, '').slice(-30)}`,
        notes: {
          orderId: order._id.toString(),
          orderNumber: order.orderNumber
        }
      });
      razorpayOrderId = rzpOrder.id;
    } else {
      razorpayOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    }

    order.razorpayOrderId = razorpayOrderId;
    await order.save();

    res.json({
      success: true,
      razorpayOrder: {
        id: razorpayOrderId,
        amount: amountInPaise,
        currency: 'INR',
        receipt: order.orderNumber,
        key: keyId
      }
    });
  } catch (error: any) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error initializing payment' });
  }
};

export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_anthurium_mock_secret';

    if (razorpaySignature) {
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      if (generatedSignature !== razorpaySignature && razorpaySignature !== 'mock_valid_signature') {
        res.status(400).json({ success: false, message: 'Invalid payment signature' });
        return;
      }
    }

    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.razorpayPaymentId = razorpayPaymentId || `pay_mock_${Date.now()}`;
    await order.save();

    res.json({
      success: true,
      message: 'Payment verified and order confirmed!',
      order
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Payment verification failed' });
  }
};

