import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Review } from '../models/Review';

export const getAdminDashboardAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments();
    const pendingReviews = await Review.countDocuments({ status: 'pending' });

    // Aggregate Total Revenue
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Low stock items
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } }).select('title sku stock price images');

    // Recent 5 Orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Sales over time (Last 7 days group)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesOverTime = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, orderStatus: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          dailyRevenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      metrics: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        pendingReviews,
        lowStockCount: lowStockProducts.length
      },
      lowStockProducts,
      recentOrders,
      salesOverTime
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching analytics' });
  }
};

export const getAdminCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });

    const customerDetails = await Promise.all(
      customers.map(async (c) => {
        const orders = await Order.find({ user: c._id });
        const totalSpent = orders.reduce((sum, o) => (o.orderStatus !== 'cancelled' ? sum + o.totalAmount : sum), 0);
        const lastOrder = orders.length > 0 ? orders[orders.length - 1].createdAt : null;
        return {
          _id: c._id,
          name: c.name,
          email: c.email,
          phone: c.phone || 'N/A',
          totalOrders: orders.length,
          totalSpent,
          lastOrder,
          createdAt: c.createdAt
        };
      })
    );

    res.json({ success: true, customers: customerDetails });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching customers' });
  }
};

export const getAdminCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await User.findById(req.params.id).select('-password');
    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }
    const orders = await Order.find({ user: customer._id }).sort({ createdAt: -1 });
    res.json({ success: true, customer, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching customer details' });
  }
};

export const getAdminInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find()
      .select('title sku stock price salePrice colors sizes variants images status category')
      .populate('category', 'name')
      .sort({ stock: 1 });

    res.json({ success: true, inventory: products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching inventory' });
  }
};

export const updateInventoryStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, stock, sku } = req.body;
    if (!productId || stock === undefined) {
      res.status(400).json({ success: false, message: 'productId and stock are required' });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    product.stock = Number(stock);
    if (sku) product.sku = sku;
    await product.save();

    res.json({ success: true, message: 'Stock updated successfully', product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating stock' });
  }
};

