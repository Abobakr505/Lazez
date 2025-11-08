import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { MenuItem } from '../types';
import { Footer } from '../components/Footer';
import { Cart } from '../components/Cart';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { Header } from '../components/Header';
import { useCart } from '../hooks/useCart';

export const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, addToCart, updateQuantity, removeFromCart, getTotal, getWhatsAppMessage } = useCart();

  // Memoize cartItemsCount to avoid unnecessary recalculations
  const cartItemsCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  // Fetch categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: catData, error: catError } = await supabase.from('categories').select('*');
        if (catError) throw new Error('فشل تحميل الفئات');
        setCategories(catData || []);
      } catch (err) {
        setError('حدث خطأ أثناء تحميل الفئات.');
        toast.error('حدث خطأ أثناء تحميل الفئات.');
      }
    };
    fetchCategories();
  }, []);

  // Fetch menu items when selectedCategory changes ('' -> all)
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Build category filter if a category is selected
        let query = supabase.from('menu_items').select('*');
        if (selectedCategory !== '') {
          // Try to coerce numeric ids where appropriate
          const maybeNumber = Number(selectedCategory as any);
          const categoryFilter = !Number.isNaN(maybeNumber) ? maybeNumber : selectedCategory;
          query = query.eq('category', categoryFilter as any);
        }

        const { data: menuData, error: menuError } = await query;
        if (menuError) throw new Error('فشل تحميل المنتجات');

        // Map snake_case DB fields to camelCase
        const mappedMenu = (menuData || []).map((m: any) => ({
          ...m,
          priceSingle: m.price_single ?? m.priceSingle ?? 0,
          priceDouble: m.price_double ?? m.priceDouble ?? undefined,
        }));

        setMenuItems(mappedMenu);
      } catch (err) {
        setError('حدث خطأ أثناء تحميل المنتجات.');
        toast.error('حدث خطأ أثناء تحميل المنتجات.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, [selectedCategory]);

  // Filter items based on selected category (client-side for faster switching)
  const filteredItems = selectedCategory
    ? menuItems.filter(item => String(item.category) === String(selectedCategory))
    : menuItems;

  // Animation variants for grid
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

  const itemVariant = {
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
    addToCart(item, size);
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
        <div className="min-h-screen bg-white">
          <Header
            cartItemsCount={cartItemsCount}
            onCartClick={() => setIsCartOpen(true)}
          />
    <section id="menu" className="py-28 bg-gradient-to-b from-[#F5F2E9] to-[#ECE8D9] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced title with subtle animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h2 className="GraphicSchool text-5xl sm:text-6xl font-extrabold text-[#B22222] mb-4 tracking-tight">
            المنيو الكامل
          </h2>
          <div className="w-32 h-1.5 bg-[#FFB400] mx-auto rounded-full"></div>
          <p className="text-gray-600 text-lg mt-4 max-w-2xl mx-auto">
            استكشف مجموعتنا الواسعة من الأطباق الشهية، مصممة لترضي جميع الأذواق.
          </p>
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
            {/* Enhanced category buttons with 'All' option */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap justify-center gap-3 mb-12"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory('')}
                className={`px-6 py-2.5 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 ${
                  selectedCategory === ''
                    ? 'bg-[#B22222] text-white shadow-md'
                    : 'bg-white text-[#B22222] border border-[#B22222] hover:bg-gray-50'
                }`}
              >
                الكل
              </motion.button>
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredItems.map((menuItem) => (
                  <motion.div
                    key={menuItem.id}
                    variants={itemVariant}
                    whileHover={{
                      y: -10,
                      scale: 1.02,
                      boxShadow: '0 10px 30px rgba(178,34,34,0.18)',
                      transition: { duration: 0.28 },
                    }}
                    layoutId={menuItem.id}
                    onClick={() => setSelectedItem(menuItem)}
                    className="bg-gradient-to-br from-[#FFF9F0] via-[#F7F3EE] to-[#FFF] rounded-3xl overflow-hidden shadow-2xl cursor-pointer border border-[#F6E8D0] group"
                  >
                    <div className="relative h-56 sm:h-64 overflow-hidden flex items-center justify-center">
                      <img
                        src={menuItem.image}
                        alt={menuItem.name}
                        className="w-full h-full object-cover rounded-t-3xl group-hover:scale-105 transition-transform duration-400 border-b-4 border-[#FFCF66]"
                        style={{ boxShadow: '0 6px 26px rgba(255,200,80,0.08)' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-[#B22222] mb-2 tracking-tight">
                        {menuItem.name}
                      </h3>
                      <p className="text-gray-700 text-base sm:text-lg mb-4 line-clamp-2 font-medium">
                        {menuItem.description}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="text-[#B22222] font-bold text-lg sm:text-xl flex flex-col gap-1">
                          {menuItem.priceDouble ? (
                            <>
                              <span className="bg-[#FFF7E6] px-2 py-1 rounded text-sm shadow-sm">سنجل: <span className="font-extrabold">{menuItem.priceSingle}</span> جنيه</span>
                              <span className="bg-[#FFF7E6] px-2 py-1 rounded text-sm shadow-sm">دبل: <span className="font-extrabold">{menuItem.priceDouble}</span> جنيه</span>
                            </>
                          ) : (
                            <span className="bg-[#FFF7E6] px-3 py-1 rounded text-lg shadow-sm">{menuItem.priceSingle} جنيه</span>
                          )}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.12, rotate: 8 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(menuItem, 'single');
                          }}
                          className="bg-[#FFB400] text-[#B22222] p-3 rounded-full hover:bg-[#FFB23A] transition-colors shadow-lg border-2 border-[#FFF8EA]"
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
                      className="absolute top-4 left-4 bg-[#FFB400] text-[#B22222] p-1 rounded-full shadow-md"
                    >
                      <X size={20} />
                    </motion.button>
                  </div>

                  <div className="p-6 sm:p-8">
                    <h3 className="text-3xl sm:text-4xl font-bold text-[#B22222] mb-4 tracking-tight">
                      {selectedItem.name}
                    </h3>
                    <p className="text-gray-700 text-base sm:text-lg mb-6 leading-relaxed">
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
                        className="w-full bg-[#FFB400] text-[#8B0000] py-3 rounded-xl font-semibold text-lg sm:text-xl hover:bg-[#FFA500] transition-colors shadow-sm"
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
                          className="w-full bg-[#B22222] text-white py-3 rounded-xl font-semibold text-lg sm:text-xl hover:bg-[#8B0000] transition-colors shadow-sm"
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
      <Footer />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        total={getTotal()}
        whatsappMessage={getWhatsAppMessage()}
      />
      <WhatsAppButton />
    </div>
  );
};