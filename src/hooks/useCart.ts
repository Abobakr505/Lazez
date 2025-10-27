// hooks/useCart.ts
import { useState } from 'react';
import { CartItem, MenuItem } from '../types';
import { toast } from 'react-toastify';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Add item to cart
  const addToCart = (item: MenuItem, size: 'single' | 'double') => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.id === item.id && cartItem.selectedSize === size
      );
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id && cartItem.selectedSize === size
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1, selectedSize: size }];
    });
    toast.success(`تم إضافة ${item.name} (${size === 'single' ? 'سنجل' : 'دبل'}) إلى السلة!`);
  };

  // Update item quantity
  const updateQuantity = (id: string, quantity: number, size?: 'single' | 'double') => {
    if (quantity < 1) {
      removeFromCart(id, size);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.selectedSize === size ? { ...item, quantity } : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (id: string, size?: 'single' | 'double') => {
    setCart((prevCart) => prevCart.filter((item) => !(item.id === id && item.selectedSize === size)));
    toast.success('تم إزالة المنتج من السلة!');
  };

  // Calculate total price
  const getTotal = () => {
    return cart.reduce((sum, item) => {
      const price = item.selectedSize === 'double' && item.price_double ? item.price_double : item.price_single;
      return sum + price * item.quantity;
    }, 0);
  };

  // Generate WhatsApp message
  const getWhatsAppMessage = () => {
    const message = cart
      .map((item) => `${item.name} (${item.selectedSize === 'single' ? 'سنجل' : 'دبل'}) x${item.quantity}`)
      .join('\n') + `\nالإجمالي: ${getTotal()} جنيه`;
    return encodeURIComponent(message);
  };

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    getTotal,
    getWhatsAppMessage,
  };
};