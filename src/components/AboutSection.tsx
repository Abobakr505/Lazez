import { motion } from 'framer-motion';
import { Award, Heart, Users, TrendingUp } from 'lucide-react';

export const AboutSection = () => {
  const features = [
    {
      icon: <Award size={50} />,
      title: 'جودة عالية',
      description: 'نستخدم أجود أنواع اللحوم والدجاج الطازج',
    },
    {
      icon: <Heart size={50} />,
      title: 'طعم لا يُنسى',
      description: 'وصفات خاصة ومذاق فريد من نوعه',
    },
    {
      icon: <Users size={50} />,
      title: 'خدمة مميزة',
      description: 'فريق محترف يسعى لإرضاء عملائنا',
    },
    {
      icon: <TrendingUp size={50} />,
      title: 'نمو مستمر',
      description: 'نتطور باستمرار لتقديم الأفضل',
    },
  ];



  // تأثيرات الظهور للصورة
  const imageVariants = {
    hidden: { opacity: 0, x: -50, scale: 0.95 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.8, type: 'spring', stiffness: 100 } },
  };

  // تأثيرات الظهور للنصوص
  const textVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, delay: i * 0.2, type: 'spring', stiffness: 100 },
    }),
  };

  // تأثيرات الظهور لكروت الميزات
  const featureVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.2, type: 'spring', stiffness: 120 },
    }),
  };

  return (
    <section id="about" className="py-24 bg-[#F9F9F9] relative overflow-hidden">
      {/* خلفية ديناميكية */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')] opacity-10"></div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="GraphicSchool text-5xl font-extrabold text-[#B22222] mb-4 tracking-tight">
            من نحن
          </h2>
          <div className="w-40 h-2 bg-[#FFB400] mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="relative group">
              <motion.img
                whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
                src="/about.jpg"
                alt="مطعم لذيذ"
                className="rounded-2xl shadow-2xl w-full object-cover h-[400px]"
              />
              <div className="absolute -bottom-8 -right-8 w-full h-full bg-[#FFB400] rounded-2xl -z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.h3
              variants={textVariants}
              custom={0}
              className=" text-3xl font-bold text-[#B22222] tracking-wide"
            >
              قصة نجاح لذيذ
            </motion.h3>
            <motion.p
              variants={textVariants}
              custom={1}
              className="text-gray-600 text-lg leading-relaxed"
            >
              بدأنا رحلتنا بحلم بسيط: تقديم أفضل برجر في المحافظة. اليوم، أصبحنا
              الوجهة المفضلة لعشاق الطعم الأصيل والجودة العالية.
            </motion.p>
            <motion.p
              variants={textVariants}
              custom={2}
              className="text-gray-600 text-lg leading-relaxed"
            >
              نفخر بتقديم منتجات طازجة يومياً، مع الحرص على أعلى معايير النظافة
              والجودة. كل برجر نقدمه هو تحفة فنية صُنعت بحب واهتمام.
            </motion.p>
            <motion.p
              variants={textVariants}
              custom={3}
              className="text-gray-600 text-lg leading-relaxed"
            >
              رؤيتنا هي أن نكون العلامة التجارية الأولى في قلوب عملائنا، ورسالتنا
              هي إسعادكم بكل وجبة نقدمها.
            </motion.p>
            <motion.a
              variants={textVariants}
              custom={4}
              whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)' }}
              whileTap={{ scale: 0.95 }}
              href="#contact"
              className="inline-block bg-gradient-to-r from-[#B22222] to-[#8B0000] text-white py-3 px-6 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300"
            >
              اكتشف المزيد
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={featureVariants}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -10, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)' }}
              className="bg-white p-8 rounded-2xl shadow-md text-center border border-gray-100 hover:border-[#FFB400] transition-all duration-300"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
                className="text-[#FFB400] mb-4 flex justify-center"
              >
                {feature.icon}
              </motion.div>
              <h4 className="text-xl font-bold text-[#B22222] mb-3 tracking-wide">
                {feature.title}
              </h4>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};