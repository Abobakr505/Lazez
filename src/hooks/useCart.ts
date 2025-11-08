import { useState, useEffect } from 'react';
import { CartItem, MenuItem } from '../types';
import { toast } from 'react-toastify';

export const useCart = () => {

  // ✅ تحميل السلة من LocalStorage عند بدء التشغيل
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch {
      return [];
    }
  });

  // ✅ حفظ السلة في LocalStorage عند أي تغيير
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ إضافة عنصر للسلة
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

  // ✅ تحديث الكمية
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

  // ✅ إزالة عنصر من السلة
  const removeFromCart = (id: string, size?: 'single' | 'double') => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === id && item.selectedSize === size))
    );
    toast.success('تم إزالة المنتج من السلة!');
  };

  // ✅ حساب الإجمالي
  const getTotal = () => {
    return cart.reduce((sum, item) => {
      const price =
        item.selectedSize === 'double' && item.price_double
          ? item.price_double
          : item.price_single;
      return sum + price * item.quantity;
    }, 0);
  };

  // ✅ رسالة الواتساب
  const getWhatsAppMessage = () => {
    const intro =
      "السلام عليكم 👋\nأريد عمل أوردر:\n\n-------------------------\n📦 تفاصيل الطلب:\n";

    const itemsText = cart
      .map(
        (item) =>
          `• ${item.name} (${item.selectedSize === "single" ? "سنجل" : "دبل"}) × ${
            item.quantity
          }`
      )
      .join("\n");

    const totalText = `\n-------------------------\n💰 الإجمالي: ${getTotal()} جنيه\n\n✅ من فضلك تأكيد الطلب.`;

    const message = `${intro}${itemsText}${totalText}`;

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
