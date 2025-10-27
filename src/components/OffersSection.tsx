import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';

export const OffersSection = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [timers, setTimers] = useState<{ [key: string]: any }>({});
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.from('offers').select('*');
        if (error) {
          toast.error('فشل تحميل العروض. حاول مرة أخرى.');
          return;
        }
        setOffers(data || []);
        toast.success('تم تحميل العروض بنجاح!');
      } catch (err) {
        toast.error('حدث خطأ أثناء تحميل العروض.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const calculateTimeLeft = (endDate?: string) => {
    if (!endDate) return null;

    const difference = new Date(endDate).getTime() - new Date().getTime();
    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers: { [key: string]: any } = {};
      offers.forEach((offer) => {
        if (offer.end_date) {
          newTimers[offer.id] = calculateTimeLeft(offer.end_date);
        }
      });
      setTimers(newTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [offers]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <section id="offers" className="py-20 bg-gradient-to-r from-[#8B0000] to-[#B22222] relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-20"></div>

      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="GraphicSchool text-5xl font-extrabold text-white mb-4">
            العروض والأخبار
          </h2>
          <div className="w-32 h-2 bg-[#FFB400] mx-auto rounded-full"></div>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center flex-col gap-4 h-64">
          <div className="w-12 h-12 border-4 border-[#FFB400] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white  text-lg">جاري تحميل المنتجات...</p>

          </div>
        ) : offers.length === 0 ? (
          <p className="text-center text-white text-xl">لا توجد عروض متاحة حاليًا.</p>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {offers.map((offer) => (
              <motion.div
                key={offer.id}
                variants={item}
                whileHover={{ scale: 1.05, rotate: 1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-2xl relative"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-4 right-4 bg-[#FFB400] text-[#8B0000] font-bold px-4 py-2 rounded-full text-lg shadow-lg z-10"
                >
                  {offer.discount}
                </motion.div>

                <div className="relative h-48 overflow-hidden">
                  <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-[#B22222] mb-3">{offer.title}</h3>
                  <p className="text-gray-700 mb-4">{offer.description}</p>

                  {offer.end_date && timers[offer.id] && (
                    <div className="bg-[#F5F2E9] rounded-xl p-4">
                      <p className="text-center text-sm text-gray-600 mb-2">
                        ينتهي العرض خلال:
                      </p>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div>
                          <div className="text-2xl font-bold text-[#B22222]">
                            {timers[offer.id].days}
                          </div>
                          <div className="text-xs text-gray-600">يوم</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-[#B22222]">
                            {timers[offer.id].hours}
                          </div>
                          <div className="text-xs text-gray-600">ساعة</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-[#B22222]">
                            {timers[offer.id].minutes}
                          </div>
                          <div className="text-xs text-gray-600">دقيقة</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-[#B22222]">
                            {timers[offer.id].seconds}
                          </div>
                          <div className="text-xs text-gray-600">ثانية</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};