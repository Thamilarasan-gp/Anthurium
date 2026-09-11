import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { Coupon } from '../models/Coupon';
import { WebsiteSettings } from '../models/WebsiteSettings';
import { AuthRequest } from '../middleware/authMiddleware';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      couponCode,
      notes,
      guestCustomer
    } = req.body;

    if (!items || !items.length) {
      res.status(400).json({ success: false, message: 'Cart items are required' });
      return;
    }

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone || !shippingAddress.street) {
      res.status(400).json({ success: false, message: 'Complete shipping address is required' });
      return;
    }

    // Get store settings for shipping thresholds and fees
    let settings = await WebsiteSettings.findOne({ storeId: 'anthurium-default' });
    const freeShippingThreshold = settings?.freeShippingThreshold || 2999;
    const baseShippingFee = settings?.shippingFee || 150;
    const codFee = settings?.codFee || 99;

    // Backend verification of prices from DB
    const verifiedItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) {
        res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
        return;
      }

      if (dbProduct.stock < item.quantity) {
        res.status(400).json({
          success: false,
          message: `Insufficient stock for '${dbProduct.title}'. Only ${dbProduct.stock} left.`
        });
        return;
      }

      const itemPrice = dbProduct.salePrice && dbProduct.salePrice < dbProduct.price ? dbProduct.salePrice : dbProduct.price;
      const lineTotal = itemPrice * item.quantity;
      calculatedSubtotal += lineTotal;

      verifiedItems.push({
        product: dbProduct._id,
        productTitle: dbProduct.title,
        productImage: dbProduct.images[0],
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        quantity: item.quantity,
        price: itemPrice
      });
    }

    // Coupon calculation
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon) {
        if (!coupon.expiryDate || new Date(coupon.expiryDate) > new Date()) {
          if (!coupon.minOrderAmount || calculatedSubtotal >= coupon.minOrderAmount) {
            if (coupon.discountType === 'percentage') {
              discountAmount = Math.round((calculatedSubtotal * coupon.discountValue) / 100);
              if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
                discountAmount = coupon.maxDiscountAmount;
              }
            } else {
              discountAmount = coupon.discountValue;
            }
            coupon.timesUsed += 1;
            await coupon.save();
          }
        }
      }
    }

    // Shipping & COD calculation
    let shippingFee = calculatedSubtotal >= freeShippingThreshold ? 0 : baseShippingFee;
    if (paymentMethod === 'cod') {
      shippingFee += codFee;
    }

    const totalAmount = Math.max(0, calculatedSubtotal - discountAmount + shippingFee);

    // Generate Order Number: e.g. ANT-20260910-8472
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ANT-${dateStr}-${randomSuffix}`;

    const userId = req.user ? req.user._id : (req.body.userId || undefined);
    const guestCustomerData = req.user
      ? undefined
      : (guestCustomer || {
          name: shippingAddress.name,
          email: shippingAddress.email,
          phone: shippingAddress.phone
        });

    const order = await Order.create({
      orderNumber,
      user: userId,
      guestCustomer: guestCustomerData,
      items: verifiedItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      orderStatus: paymentMethod === 'cod' ? 'confirmed' : 'pending',
      subtotal: calculatedSubtotal,
      discountAmount,
      shippingFee,
      taxAmount: Math.round(calculatedSubtotal * 0.05),
      totalAmount,
      couponCode,
      notes
    });

    // Update Product stock
    for (const item of verifiedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error creating order' });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const userId = req.user._id;
    const userEmail = (req.user.email || '').toLowerCase().trim();
    const cleanPhone = (req.user.phone || '').replace(/\D/g, '');
    const userName = (req.user.name || '').trim();

    const orConditions: any[] = [{ user: userId }];

    if (userEmail) {
      orConditions.push({ 'guestCustomer.email': new RegExp(`^${userEmail}$`, 'i') });
      orConditions.push({ 'shippingAddress.email': new RegExp(`^${userEmail}$`, 'i') });
    }

    if (cleanPhone && cleanPhone.length >= 10) {
      const phoneEnd = cleanPhone.slice(-10);
      orConditions.push({ 'guestCustomer.phone': new RegExp(`${phoneEnd}$`) });
      orConditions.push({ 'shippingAddress.phone': new RegExp(`${phoneEnd}$`) });
    }

    if (userName && userName.length > 2) {
      orConditions.push({ 'shippingAddress.name': new RegExp(`^${userName}$`, 'i') });
    }

    const orders = await Order.find({ $or: orConditions })
      .sort({ createdAt: -1 })
      .populate('items.product', 'title slug images price salePrice');

    // Auto-link any unlinked matching orders to this user in DB
    for (const ord of orders) {
      if (!ord.user) {
        ord.user = userId as any;
        await ord.save();
      }
    }

    res.json({ success: true, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching orders' });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('user', 'name email phone');

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching order' });
  }
};

export const trackOrderByNumber = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderNumberStr = String(req.params.orderNumber).trim().toUpperCase();
    const order = await Order.findOne({ orderNumber: orderNumberStr });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error tracking order' });
  }
};

// Admin Order Endpoints
export const getAllOrdersAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query: any = {};

    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    if (search) {
      const reg = new RegExp(String(search), 'i');
      query.$or = [{ orderNumber: reg }, { 'shippingAddress.name': reg }, { 'shippingAddress.phone': reg }];
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: orders.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      orders
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching admin orders' });
  }
};

export const updateOrderStatusAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus, trackingNumber, courierName } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (courierName) order.courierName = courierName;

    await order.save();

    res.json({ success: true, message: 'Order status updated successfully', order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating order status' });
  }
};

export const linkOrderToUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { orderNumber } = req.body;
    if (!orderNumber) {
      res.status(400).json({ success: false, message: 'Order number is required' });
      return;
    }

    const orderNumberStr = String(orderNumber).trim().toUpperCase();
    const order = await Order.findOne({ orderNumber: orderNumberStr });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found with this number' });
      return;
    }

    order.user = req.user._id as any;
    await order.save();

    res.json({ success: true, message: `Order #${order.orderNumber} successfully linked to your profile`, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error linking order' });
  }
};
