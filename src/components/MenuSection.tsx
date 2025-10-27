import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { MenuItem } from '../types';

interface MenuSectionProps {
  onAddToCart: (item: MenuItem, size: 'single' | 'double') => void;
}

export const MenuSection = ({ onAddToCart }: MenuSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch categories first
        const { data: catData, error: catError } = await supabase.from('categories').select('*');
        if (catError) throw new Error('فشل تحميل الفئات');
        setCategories(catData || []);
        
        // Set initial category if not set
        if (!selectedCategory && catData && catData.length > 0) {
          setSelectedCategory(catData[0].id);
        }

        // Fetch menu items for the selected category
        const { data: menuData, error: menuError } = await supabase
          .from('menu_items')
          .select('*')
          .eq('category', selectedCategory || (catData && catData[0]?.id));
        
        if (menuError) throw new Error('فشل تحميل المنتجات');
        
        setMenuItems(menuData || []);
        toast.success('تم تحميل المنيو بنجاح!');
      } catch (err) {
        setError('حدث خطأ أثناء تحميل البيانات.');
        toast.error('حدث خطأ أثناء تحميل البيانات.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory]); // Re-fetch when category changes

  // إظهار جميع المنتجات إذا لم يتم اختيار فئة
  const filteredItems = selectedCategory 
    ? menuItems.filter(item => item.category === selectedCategory)
    : menuItems;

  // تحسين الحركات للشبكة
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const handleAddToCart = (item: MenuItem, size: 'single' | 'double') => {
    onAddToCart(item, size);
    toast.success(`تم إضافة ${item.name} (${size === 'single' ? 'سنجل' : 'دبل'}) إلى السلة!`, {
      position: 'top-right',
      autoClose: 2000,
    });
  };

  if (error) {
    return (
      <section className="py-20 bg-[#F5F2E9]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[#B22222] text-xl font-semibold">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-24 bg-gradient-to-b from-[#F5F2E9] to-[#ECE8D9]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* تحسين العنوان */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl sm:text-6xl font-extrabold text-[#B22222] mb-4 ">
            المنيو
          </h2>
          <div className="w-24 h-1.5 bg-[#FFB400] mx-auto rounded-full"></div>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center flex-col gap-6 h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-[#B22222] border-t-transparent rounded-full"
            ></motion.div>
            <p className="text-gray-700 text-lg">جاري تحميل المنتجات...</p>
          </div>
        ) : (
          <>
            {/* تحسين أزرار الفئات */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap justify-center gap-3 mb-12"
            >
  {categories.map((cat) => (
    <motion.button
      key={cat.id}
      whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setSelectedCategory(cat.id)}
      className={`px-6 py-2.5 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 ${
        selectedCategory === cat.id
          ? 'bg-[#B22222] text-white shadow-md'
          : 'bg-white text-[#B22222] border border-[#B22222] hover:bg-gray-50'
      }`}
    >
      {cat.icon} {cat.name}
    </motion.button>
  ))}
            </motion.div>

            {filteredItems.length === 0 ? (
              <p className="text-center text-[#B22222] text-xl">
                لا توجد عناصر متاحة في هذه الفئة.
              </p>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredItems.map((menuItem) => (
                  <motion.div
                    key={menuItem.id}
                    variants={item}
                    whileHover={{
                      y: -8,
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                      transition: { duration: 0.3 },
                    }}
                    layoutId={menuItem.id}
                    onClick={() => setSelectedItem(menuItem)}
                    className="bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer"
                  >
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      <img
                        src={menuItem.image}
                        alt={menuItem.name}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-xl sm:text-2xl font-bold text-[#B22222] mb-2 ">
                        {menuItem.name}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-2">
                        {menuItem.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="text-[#B22222] font-semibold ">
                          {menuItem.priceDouble ? (
                            <>
                              <div className="text-sm">سنجل: {menuItem.priceSingle} جنيه</div>
                              <div className="text-sm">دبل: {menuItem.priceDouble} جنيه</div>
                            </>
                          ) : (
                            <div className="text-lg sm:text-xl">{menuItem.priceSingle} جنيه</div>
                          )}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(menuItem, 'single');
                          }}
                          className="bg-[#FFB400] text-[#8B0000] p-2.5 rounded-full hover:bg-[#FFA500] transition-colors"
                        >
                          <Plus size={20} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {selectedItem && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                onClick={() => setSelectedItem(null)}
                className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 sm:p-6"
              >
                <motion.div
                  layoutId={selectedItem.id}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-auto shadow-2xl"
                >
                  <div className="relative h-64 sm:h-72">
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.name}
                      className="w-full h-full object-cover rounded-t-2xl"
                    />
                    <motion.button
                          whileHover={{ scale: 1.2, rotate: 90 }}
                          whileTap={{ scale: 0.8 }}
                      onClick={() => setSelectedItem(null)}
                          className="absolute top-4 left-4 text-[#B22222] bg-[#FFB400] hover:bg-[#FFB400] p-1 rounded-full"
                        >
                          <X size={20} />
                        </motion.button>
                  </div>

                  <div className="p-6 sm:p-8">
                    <h3 className="text-3xl sm:text-4xl font-bold text-[#B22222] mb-4 ">
                      {selectedItem.name}
                    </h3>
                    <p className="text-gray-700 text-base sm:text-lg mb-6">
                      {selectedItem.description}
                    </p>

                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleAddToCart(selectedItem, 'single');
                          setSelectedItem(null);
                        }}
                        className="w-full bg-[#FFB400] text-[#8B0000] py-3 rounded-xl font-semibold text-lg sm:text-xl hover:bg-[#FFA500] transition-colors "
                      >
                        سنجل - {selectedItem.priceSingle} جنيه
                      </motion.button>

                      {selectedItem.priceDouble && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            handleAddToCart(selectedItem, 'double');
                            setSelectedItem(null);
                          }}
                          className="w-full bg-[#B22222] text-white py-3 rounded-xl font-semibold text-lg sm:text-xl hover:bg-[#8B0000] transition-colors "
                        >
                          دبل - {selectedItem.priceDouble} جنيه
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
};