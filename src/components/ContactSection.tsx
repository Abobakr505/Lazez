import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import emailjs from 'emailjs-com';
import Swal from 'sweetalert2';
import { Phone, MapPin, Mail, Facebook, Instagram } from 'lucide-react';

export const ContactSection = () => {
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const RECEIVER_EMAIL = 'abobakrhasan5335@email.com'; // ضع هنا الإيميل الذي تريد الإرسال له
  const contactInfo = [
    {
      icon: <Phone size={36} />,
      title: 'الهاتف',
      content: '01023142309',
      link: 'tel:01023142309',
    },
    {
      icon: <MapPin size={36} />,
      title: 'العنوان',
      content: '📍العنوان: مركز المراغة - شارع كورنيش النيل بجانب الكنيسة',
      link: 'https://maps.app.goo.gl/oFAM71NNwyhoZp4q6',
    },
    {
      icon: <Mail size={36} />,
      title: 'البريد الإلكتروني',
      content: 'info@lazeez.com',
      link: 'mailto:info@lazeez.com',
    },
  ];

  return (
    <section id="contact" className="py-24 bg-[#F5F2E9] relative overflow-hidden">
      {/* خلفية ديناميكية */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')] opacity-10"></div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h2 className="GraphicSchool text-5xl font-extrabold text-[#B22222] mb-4 tracking-tight">
            تواصل معنا
          </h2>
          <div className="w-40 h-2 bg-[#FFB400] mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={info.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}
                className="flex items-center gap-6 bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="bg-gradient-to-br from-[#B22222] to-[#8B0000] text-[#FFB400] p-4 rounded-full">
                  {info.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#B22222] mb-1 tracking-wide">
                    {info.title}
                  </h4>
                  <p className="text-gray-600 text-lg">{info.content}</p>
                </div>
              </motion.a>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white p-8 rounded-2xl shadow-md"
            >
              <h4 className="text-xl font-bold text-[#B22222] mb-6 tracking-wide">
                تابعنا على
              </h4>
              <div className="flex gap-6 justify-center">
                <motion.a
                  whileHover={{ scale: 1.3, rotate: 5, boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)' }}
                  href="https://www.facebook.com/profile.php?id=61577143841987"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-[#B22222] to-[#8B0000] text-[#FFB400] p-4 rounded-full hover:shadow-xl transition-all duration-300"
                >
                  <Facebook size={32} />
                </motion.a>
                {/* <motion.a
                  whileHover={{ scale: 1.3, rotate: -5, boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)' }}
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-[#B22222] to-[#8B0000] text-[#FFB400] p-4 rounded-full hover:shadow-xl transition-all duration-300"
                >
                  <Instagram size={32} />
                </motion.a> */}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white p-10 rounded-2xl shadow-md"
          >
            <h3 className="text-2xl font-bold text-[#B22222] mb-8 tracking-wide">
              أرسل رسالة
            </h3>
            <form ref={formRef} className="space-y-6" onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              // إضافة الإيميل المرسل إليه في بيانات النموذج
              formRef.current.receiver_email.value = RECEIVER_EMAIL;
              try {
                const result = await emailjs.sendForm(
                  'service_1bdsc8t',
                  'template_zvn7klm',
                  formRef.current,
                  'k9Ti1ib4trNRh4VAQ'
                );
                if (result.status === 200) {
                  Swal.fire({
                    title: 'تم الإرسال!',
                    text: 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً!',
                    icon: 'success',
                    confirmButtonText: 'موافق',
                    customClass: {
                      popup: 'bg-white/95 rounded-xl',
                      title: 'text-xl font-bold text-green-700 ',
                      confirmButton: 'bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg'
                    }
                  });
                  setFormData({ name: '', phone: '', message: '' });
                }
              } catch (error) {
                Swal.fire({
                  title: 'خطأ!',
                  text: 'حدث خطأ أثناء إرسال الرسالة. الرجاء المحاولة مرة أخرى.',
                  icon: 'error',
                  confirmButtonText: 'موافق',
                  customClass: {
                    popup: 'bg-white/95 rounded-xl',
                    title: 'text-xl font-bold text-red-700',
                    confirmButton: 'bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg'
                  }
                });
              } finally {
                setIsSubmitting(false);
              }
            }}>
              <input type="hidden" name="receiver_email" value="" />
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  الاسم
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#B22222] focus:ring-2 focus:ring-[#FFB400] focus:outline-none transition-all duration-300"
                  placeholder="أدخل اسمك"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#B22222] focus:ring-2 focus:ring-[#FFB400] focus:outline-none transition-all duration-300"
                  placeholder="أدخل رقم هاتفك"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  الرسالة
                </label>
                <textarea
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#B22222] focus:ring-2 focus:ring-[#FFB400] focus:outline-none transition-all duration-300 resize-none"
                  placeholder="اكتب رسالتك هنا"
                  required
                ></textarea>
              </div>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)' }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#B22222] to-[#8B0000] text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60"
              >
                {isSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة'}
              </motion.button>
            </form>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-100"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28514.161424646638!2d31.637428450983492!3d26.703814369386883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14458aeccc9ab055%3A0xc4c2be8f25b071f6!2z2KfZhNmF2LHYp9i62KnYjCDZhdix2YPYsiDYp9mE2YXYsdin2LrYqdiMINmF2K3Yp9mB2LjYqSDYs9mI2YfYp9is!5e0!3m2!1sar!2seg!4v1761562246591!5m2!1sar!2seg"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="filter grayscale-10 hover:grayscale-0 transition-all duration-500"
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
};