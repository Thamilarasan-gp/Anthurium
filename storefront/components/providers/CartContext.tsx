'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@shared/types';
import { api } from '../../lib/api';

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, selectedColor?: { name: string; hex: string }, selectedSize?: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await api.getCart();
      if (res.success && res.cart && Array.isArray(res.cart.items)) {
        setCartItems(res.cart.items);
      }
    } catch (e) {
      console.error('Error fetching cart:', e);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = async (
    product: Product,
    selectedColor?: { name: string; hex: string },
    selectedSize?: string,
    quantity: number = 1
  ) => {
    const itemPrice = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;

    // Optimistic UI update
    setCartItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.product._id === product._id &&
          item.selectedSize === selectedSize &&
          item.selectedColor?.name === selectedColor?.name
      );
      if (existing) {
        return prev.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          _id: `temp_${Date.now()}`,
          product,
          selectedColor,
          selectedSize,
          quantity,
          price: itemPrice
        }
      ];
    });

    setIsCartOpen(true);

    try {
      const res = await api.addToCart({
        productId: product._id,
        selectedColor,
        selectedSize,
        quantity
      });
      if (res.success && res.cart && Array.isArray(res.cart.items)) {
        setCartItems(res.cart.items);
      }
    } catch (err) {
      console.error('Failed to sync cart:', err);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(itemId);
    }

    setCartItems((prev) =>
      prev.map((item) => (item._id === itemId ? { ...item, quantity } : item))
    );

    try {
      const res = await api.updateCartItem(itemId, quantity);
      if (res.success && res.cart && Array.isArray(res.cart.items)) {
        setCartItems(res.cart.items);
      }
    } catch (err) {
      console.error('Failed to update cart item:', err);
    }
  };

  const removeFromCart = async (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== itemId));

    try {
      const res = await api.removeCartItem(itemId);
      if (res.success && res.cart && Array.isArray(res.cart.items)) {
        setCartItems(res.cart.items);
      }
    } catch (err) {
      console.error('Failed to remove cart item:', err);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
