import { motion } from 'framer-motion';
import { AlertTriangle, Sparkles, Home, RefreshCw, ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function Error404() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-5, 5, -5],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e17] via-slate-900 to-[#1e293b] flex items-center justify-center p-4 relative overflow-hidden">
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

 

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl text-center relative z-10 pt-24"
      >
        {/* Main Error Orb */}
        <motion.div 
          variants={itemVariants}
          {...floatingVariants}
          className="relative mx-auto mb-8"
        >
          <div className="w-48 h-48 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-full border-4 border-red-500/30 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <motion.div 
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 15, repeat: Infinity }}
              className="w-32 h-32 bg-gradient-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center shadow-xl"
            >
              <AlertTriangle className="w-16 h-16 text-white drop-shadow-lg" />
            </motion.div>
          </div>
          
          {/* Floating Stars */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                x: [0, Math.sin(i) * 100, 0],
                y: [0, Math.cos(i) * 50, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="absolute w-4 h-4 text-yellow-400"
              style={{
                top: `${20 + i * 10}%`,
                left: `${50 + i * 10}%`,
                transform: `translate(-50%, -50%)`
              }}
            >
              <Star />
            </motion.div>
          ))}
        </motion.div>

        {/* Title */}
        <motion.h1 
          variants={itemVariants}
          className="text-8xl md:text-9xl font-bold text-white mb-4 leading-tight"
        >
          <motion.span 
            animate={{ 
              backgroundPosition: ['0% 50%', '200% 50%', '0% 50%'],
              color: ['#ffffff', '#ef4444', '#B22222']
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="bg-gradient-to-r from-red-400 via-rose-400 to-red-500 bg-clip-text text-transparent"
          >
            404
          </motion.span>
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-2xl md:text-3xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          <span className="text-red-400">عفواً!</span> الصفحة التي تبحث عنها غير موجودة 
        </motion.p>

        <motion.p 
          variants={itemVariants}
          className="text-lg text-gray-400 mb-12 max-w-md mx-auto"
        >
          الصفحة التي تبحث عنها غير موجودة أو انتقلت إلى صفحة خاطئه  🚀
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          s
        >
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#8B0000] to-[#B22222] text-white rounded-2xl font-bold text-lg shadow-lg shadow-[#B22222]"
            >
              <Home className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              العودة للرئيسية
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-colors"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            إعادة تحميل
          </motion.button>
        </motion.div>

        {/* Funny Stats */}
        <motion.div 
          variants={itemVariants}
          className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto pt-8 "
        >
          {[
            { num: '404', label: 'صفحات مفقودة', icon: AlertTriangle, color: '#ef4444' },
            { num: '100%', label: 'رضا العملاء', icon: Star, color: '#fbbf24' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1, y: -5 }}
              className="group p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
            >
              <div className="flex items-center justify-center mb-2">
                <stat.icon className={`w-6 h-6 ${stat.color === '#ef4444' ? 'text-red-400' : stat.color === '#10b981' ? 'text-emerald-400' : 'text-yellow-400'}`} />
              </div>
              <div className="text-2xl font-bold text-white">{stat.num}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}