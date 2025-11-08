import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (address: string, notes: string) => void;
}

export const OrderInfoModal = ({ isOpen, onClose, onConfirm }: Props) => {
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* خلفية */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* ✅ ✅ مركز الشاشة الحقيقي */}
          <motion.div
            className="
              fixed inset-0 z-[9999]
              flex items-center justify-center
              p-4
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="
                w-full max-w-md 
                bg-white dark:bg-dark-900/90 
                backdrop-blur-xl
                rounded-2xl p-7 shadow-2xl border border-white/20
              "
              initial={{ scale: 0.7, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#B22222]">بيانات الطلب</h2>
                <button onClick={onClose}>
                  <X size={26} className="text-gray-600 hover:scale-110 transition" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="font-bold text-gray-700 text-sm">العنوان:</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="أدخل عنوان التوصيل"
                    className="w-full mt-2 p-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-[#B22222] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 text-sm">ملحوظات:</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="مثال: بدون بصل، زيادة جبنة..."
                    className="w-full mt-2 p-3 rounded-xl border bg-gray-50 h-28 focus:ring-2 focus:ring-[#B22222] outline-none"
                  ></textarea>
                </div>
              </div>

              <motion.button
                onClick={() => onConfirm(address, notes)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-[#B22222] text-white py-3 mt-6 rounded-xl font-bold text-lg shadow-lg"
              >
                تأكيد وإرسال الطلب
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
