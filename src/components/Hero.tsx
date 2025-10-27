import { motion } from 'framer-motion';

export const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // متغيرات الحركة للجزيئات
  const particleVariants = {
    animate: {
      y: [0, -30, 0],
      x: [0, 15, -15, 0],
      scale: [1, 1.2, 1],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: Math.random() * 3,
      },
    },
  };

  // متغيرات الحركة للتوهج
  const glowVariants = {
    animate: {
      scale: [1, 1.3, 1],
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-r from-[#8B0000] to-[#B22222] pt-20"
    >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-20"></div>

      {/* خلفية الجزيئات والتوهج */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        {/* جزيئات متحركة */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            variants={particleVariants}
            animate="animate"
            className="absolute w-3 h-3 bg-[#FFB400] rounded-full blur-sm shadow-[0_0_10px_#FFB400]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              scale: Math.random() * 0.5 + 0.5,
            }}
          />
        ))}
        {/* دوائر التوهج */}
        <motion.div
          variants={glowVariants}
          animate="animate"
          className="absolute top-10 left-10 w-80 h-80 bg-gradient-to-r from-[#FFB400] to-[#FFCC54] rounded-full blur-3xl opacity-90 z-30"
        />
        <motion.div
          variants={glowVariants}
          animate="animate"
          className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-[#FF6347] to-[#FFB400] rounded-full blur-3xl opacity-90 z-30"
        />
        {/* تأثير موجي خفيف */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-[#B22222] to-transparent z-20"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 1.2, bounce: 0.4 }}
            className="mb-10 flex justify-center"
          >
            <motion.img
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 8, -8, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              src="/logo.jpg"
              alt="لذيذ"
              className="w-56 h-56 md:w-72 md:h-72 rounded-full border-8 border-[#FFB400] shadow-[0_0_20px_#FFB400] object-cover"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: 'easeOut' }}
            className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl tracking-tight"
          >
            لو الطعم له عنوان...
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.9, ease: 'easeOut' }}
            className="text-4xl md:text-6xl font-bold text-[#FFB400] mb-12 drop-shadow-2xl"
          >
            إحنا اسمه{' '}
            <span className="bg-gradient-to-br from-[#FFB400] to-[#FFCC54] text-transparent bg-clip-text Lalezar text-shadow-lg">
              لــذيــذ
            </span>{' '}
            🍔🔥
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.9, ease: 'easeOut' }}
            className="flex flex-row sm:flex-row gap-6 justify-center items-center"
          >
            <motion.button
              whileHover={{
                scale: 1.1,
                boxShadow: '0 15px 30px rgba(0,0,0,0.4), 0 0 15px #FFB400',
                backgroundColor: '#FFA500',
              }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scrollToSection('menu')}
              className="px-8 py-4 md:px-12 md:py-5 bg-[#FFB400] text-[#8B0000] rounded-full font-bold text-xl shadow-lg hover:bg-[#FFA500] transition-all duration-300"
            >
              شوف المنيو
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.1,
                boxShadow: '0 15px 30px rgba(0,0,0,0.4), 0 0 15px #FFFFFF',
                backgroundColor: '#F5F5F5',
              }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scrollToSection('menu')}
              className="px-8 py-4 md:px-12 md:py-5 bg-white text-[#B22222] rounded-full font-bold text-xl shadow-lg hover:bg-gray-100 transition-all duration-300"
            >
              اطلب الآن
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-16"
          >
            <a href="#about">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:block"
              >
                <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center relative">
                  <div className="w-1 h-3 bg-gradient-to-b from-[#FFB400] to-[#FFCC54] rounded-full mt-2 animate-pulse" />
                  <div className="absolute -bottom-6 text-white/70 text-xs whitespace-nowrap">
                    اكتشف المزيد
                  </div>
                </div>
              </motion.div>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};