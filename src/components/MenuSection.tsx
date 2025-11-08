import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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

        // Map snake_case DB fields to camelCase expected by components/types
        const mappedMenu = (menuData || []).map((m: any) => ({
          ...m,
          // preserve existing camelCase if already present, otherwise map
          priceSingle: m.price_single ?? m.priceSingle ?? 0,
          priceDouble: m.price_double ?? m.priceDouble ?? undefined,
        }));
        
        setMenuItems(mappedMenu);
        console.log('Fetched menu items:', mappedMenu);
      } catch (err) {
        setError('حدث خطأ أثناء تحميل البيانات.');
        toast.error('حدث خطأ أثناء تحميل البيانات.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory]); // Re-fetch when category changes

  // إظهار فقط أول 3 منتجات من كل فئة
  let filteredItems: MenuItem[] = [];
  if (selectedCategory) {
    filteredItems = menuItems.filter(item => item.category === selectedCategory).slice(0, 3);
  } else {
    // إذا لم يتم اختيار فئة، اعرض أول 3 منتجات من كل فئة
    const itemsByCategory: { [key: string]: MenuItem[] } = {};
    menuItems.forEach(item => {
      if (!itemsByCategory[item.category]) itemsByCategory[item.category] = [];
      if (itemsByCategory[item.category].length < 3) {
        itemsByCategory[item.category].push(item);
      }
    });
    filteredItems = Object.values(itemsByCategory).flat();
  }

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
                key={selectedCategory}
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredItems.map((menuItem) => (
                  <motion.div
                    key={menuItem.id}
                    variants={item}
                    whileHover={{
                      y: -10,
                      scale: 1.03,
                      boxShadow: '0 8px 32px rgba(178,34,34,0.18)',
                      transition: { duration: 0.3 },
                    }}
                    layoutId={menuItem.id}
                    onClick={() => setSelectedItem(menuItem)}
                    className="bg-gradient-to-br from-[#FFF7E6] via-[#F5F2E9] to-[#FFF] rounded-3xl overflow-hidden shadow-xl cursor-pointer border border-[#F5E1C3] group"
                  >
                    <div className="relative h-52 sm:h-64 overflow-hidden flex items-center justify-center">
                      <img
                        src={menuItem.image}
                        alt={menuItem.name}
                        className="w-full h-full object-cover rounded-t-3xl group-hover:scale-105 transition-transform duration-400 border-b-4 border-[#FFB400]"
                        style={{ boxShadow: '0 4px 24px rgba(255,180,0,0.10)' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      <span className="absolute top-3 right-3 bg-[#FFB400] text-[#B22222] px-3 py-1 rounded-full text-xs font-bold shadow-md">جديد</span>
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-[#B22222] mb-2 tracking-tight drop-shadow-sm">
                        {menuItem.name}
                      </h3>
                      <p className="text-gray-700 text-base sm:text-lg mb-4 line-clamp-2 font-medium">
                        {menuItem.description}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="text-[#B22222] font-bold text-lg sm:text-xl flex flex-col gap-1">
                          {menuItem.priceDouble ? (
                            <>
                              <span className="bg-[#FFF7E6] px-2 py-1 rounded text-sm shadow">سنجل: <span className="font-extrabold">{menuItem.priceSingle}</span> جنيه</span>
                              <span className="bg-[#FFF7E6] px-2 py-1 rounded text-sm shadow">دبل: <span className="font-extrabold">{menuItem.priceDouble}</span> جنيه</span>
                            </>
                          ) : (
                            <span className="bg-[#FFF7E6] px-2 py-1 rounded text-lg shadow">{menuItem.priceSingle} جنيه</span>
                          )}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.15, rotate: 10 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(menuItem, 'single');
                          }}
                          className="bg-[#FFB400] text-[#B22222] p-3 rounded-full hover:bg-[#FFA500] transition-colors shadow-lg border-2 border-[#FFF7E6]"
                        >
                          <Plus size={26} />
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
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
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
        <div className="mt-16 text-center">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/menu')}
            className="px-8 py-4 rounded-full font-semibold text-lg bg-[#B22222] text-white hover:bg-[#8B0000] transition-all duration-300"
          >
            اكتشف المزيد
          </motion.button>
        </div>
      </div>
    </section>
  );
};