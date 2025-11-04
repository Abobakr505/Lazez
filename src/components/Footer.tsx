import { motion } from 'framer-motion';
import { Heart, Facebook, Instagram } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#8B0000] to-[#B22222] text-white py-12 relative overflow-hidden">
      {/* تأثير خلفية ديناميكي */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          <motion.div
            whileHover={{ scale: 1.1, filter: 'drop-shadow(0 0 10px rgba(255, 180, 0, 0.7))' }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="inline-flex items-center gap-3 mb-6 text-4xl"
          >
            <span className="Lalezar text-4xl font-extrabold text-[#FFB400] tracking-tight">لــذيــذ</span>🍔
          </motion.div>

          <p className="text-gray-100 text-lg mb-4 font-medium tracking-wide">
            لو الطعم له عنوان... إحنا اسمه
          </p>

          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.a
              whileHover={{ scale: 1.2, rotate: 5 }}
              href="https://www.facebook.com/profile.php?id=61577143841987"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFB400] hover:text-white transition-colors"
            >
              <Facebook size={24} />
            </motion.a>
            {/* <motion.a
              whileHover={{ scale: 1.2, rotate: -5 }}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFB400] hover:text-white transition-colors"
            >
              <Instagram size={24} />
            </motion.a> */}
          </div>

          <div className="flex items-center justify-center  gap-2 text-sm text-gray-200">

            <span>© 2025 مطعم لذيذ. جميع الحقوق محفوظة</span>
          </div>            
          <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-200">
              <span>صُنع بـ</span>
            <motion.div
              animate={{ scale: [1, 1.4, 1], rotate: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Heart size={18} fill="currentColor" className="text-[#FFB400]" />
            </motion.div>
            <span>من</span>
          <span className="bracket text-[#FFB400] ">{"<"}</span>
            <a
              href="https://bakrhasan.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFB400] hover:underline"
            >
              أبوبكر حسن
            </a>
            <span className="bracket text-[#FFB400]">{">"}</span>
            </div>
        </div>
      </div>
    </footer>
  );
};