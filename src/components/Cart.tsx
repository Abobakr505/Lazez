import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Send } from 'lucide-react';
import { useState } from "react";
import { CartItem } from '../types';
import { OrderInfoModal } from "./OrderInfoModal";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, quantity: number, size?: 'single' | 'double') => void;
  onRemove: (id: string, size?: 'single' | 'double') => void;
  total: number;
  whatsappMessage: string;
}

export const Cart = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemove,
  total,
  whatsappMessage,
}: CartProps) => {

  const phone = "201023142309"; // ✅ بدون +
  const [openModal, setOpenModal] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            <div className="bg-gradient-to-r from-[#B22222] to-[#8B0000] text-white p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">سلة الطلبات</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={24} />
                </motion.button>
              </div>
              <p className="text-[#FFB400]">{cart.length} منتج</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center"
                >
                  <ShoppingBag size={80} className="text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">السلة فارغة</p>
                </motion.div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
                  }}
                  className="space-y-4"
                >
                  {cart.map((item) => {
                    const price =
                      item.selectedSize === "double" ? item.price_double : item.price_single;

                    return (
                      <motion.div
                        key={`${item.id}-${item.selectedSize}`}
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          show: { opacity: 1, x: 0 },
                        }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-[#F5F2E9] rounded-xl p-4 relative"
                      >
                        <motion.button
                          whileHover={{ scale: 1.2, rotate: 90 }}
                          whileTap={{ scale: 0.8 }}
                          onClick={() => onRemove(item.id, item.selectedSize)}
                          className="absolute top-2 left-2 text-[#B22222] p-1 rounded-full"
                        >
                          <X size={20} />
                        </motion.button>

                        <div className="flex gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />

                          <div className="flex-1">
                            <h4 className="font-bold text-[#B22222] mb-1">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {item.selectedSize === "double" ? "دبل" : "سنجل"}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 bg-white rounded-lg p-1">
                                <motion.button
                                  whileHover={{ scale: 1.2 }}
                                  whileTap={{ scale: 0.8 }}
                                  onClick={() =>
                                    onUpdateQuantity(item.id, item.quantity - 1, item.selectedSize)
                                  }
                                  className="text-[#B22222] p-1 rounded"
                                >
                                  <Minus size={16} />
                                </motion.button>

                                <span className="font-bold text-[#B22222] w-8 text-center">
                                  {item.quantity}
                                </span>

                                <motion.button
                                  whileHover={{ scale: 1.2 }}
                                  whileTap={{ scale: 0.8 }}
                                  onClick={() =>
                                    onUpdateQuantity(item.id, item.quantity + 1, item.selectedSize)
                                  }
                                  className="text-[#B22222] p-1 rounded"
                                >
                                  <Plus size={16} />
                                </motion.button>
                              </div>

                              <div className="font-bold text-[#B22222] text-lg">
                                {price * item.quantity} جنيه
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t-2 border-gray-200 p-6 space-y-4">
                <div className="flex items-center justify-between text-xl font-bold">
                  <span className="text-gray-700">الإجمالي:</span>
                  <span className="text-[#B22222] text-2xl">{total} جنيه</span>
                </div>

                <motion.button
                  onClick={() => setOpenModal(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3"
                >
                  <Send size={24} />
                  متابعة الطلب
                </motion.button>
              </div>
            )}
          </motion.div>

          <OrderInfoModal
            isOpen={openModal}
            onClose={() => setOpenModal(false)}
            onConfirm={(address, notes) => {
              const finalMessage =
                decodeURIComponent(whatsappMessage) +
                `\n\n📍 العنوان: ${address || "غير محدد"}` +
                `\n📝 ملاحظات: ${notes || "لا يوجد"}`;

              const url = `https://wa.me/${phone}?text=${encodeURIComponent(finalMessage)}`;
              window.open(url, "_blank");
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
};
