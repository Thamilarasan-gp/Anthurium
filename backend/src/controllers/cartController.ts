import { Response } from 'express';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';
import { AuthRequest } from '../middleware/authMiddleware';

export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user ? req.user._id : undefined;
    const sessionId = req.headers['x-session-id'] as string;

    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId }).populate('items.product');
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId }).populate('items.product');
    }

    if (!cart) {
      res.json({ success: true, cart: { items: [], subtotal: 0 } });
      return;
    }

    res.json({ success: true, cart });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching cart' });
  }
};

export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user ? req.user._id : undefined;
    const sessionId = (req.headers['x-session-id'] as string) || req.body.sessionId;
    const { productId, selectedColor, selectedSize, quantity = 1 } = req.body;

    if (!productId) {
      res.status(400).json({ success: false, message: 'ProductId is required' });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const itemPrice = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;

    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
      cart = new Cart({
        user: userId,
        sessionId: userId ? undefined : sessionId || `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        items: [],
        subtotal: 0
      });
    }

    const existingIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor?.name === selectedColor?.name
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        product: productId as any,
        selectedColor,
        selectedSize,
        quantity: Number(quantity),
        price: itemPrice
      });
    }

    cart.subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.product');

    res.json({
      success: true,
      message: 'Item added to cart',
      cart: updatedCart
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error adding to cart' });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user ? req.user._id : undefined;
    const sessionId = req.headers['x-session-id'] as string;
    const { itemId } = req.params;
    const { quantity } = req.body;

    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
      res.status(404).json({ success: false, message: 'Cart not found' });
      return;
    }

    const itemIndex = cart.items.findIndex((item) => item._id?.toString() === itemId);
    if (itemIndex === -1) {
      res.status(404).json({ success: false, message: 'Cart item not found' });
      return;
    }

    if (Number(quantity) <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = Number(quantity);
    }

    cart.subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json({ success: true, message: 'Cart updated', cart: updatedCart });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating cart' });
  }
};

export const removeCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user ? req.user._id : undefined;
    const sessionId = req.headers['x-session-id'] as string;
    const { itemId } = req.params;

    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
      res.status(404).json({ success: false, message: 'Cart not found' });
      return;
    }

    cart.items = cart.items.filter((item) => item._id?.toString() !== itemId);
    cart.subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json({ success: true, message: 'Item removed from cart', cart: updatedCart });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error removing cart item' });
  }
};
