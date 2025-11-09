import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuItem, Offer, Category } from '../types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Upload, Edit, Trash2, ChevronDown } from 'lucide-react';

// أضف نوع جديد للرسائل إذا لم يكن موجوداً في types.ts
interface Message {
  id: string;
  name: string;
  phone: string;
  message: string;
  created_at: string;
}

export const Dashboard = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]); // حالة جديدة للرسائل
  const [formData, setFormData] = useState<any>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'menu' | 'offers' | 'news' | 'categories' | 'messages'>('menu'); // أضف 'messages'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const navigate = useNavigate();
  // 🔐 Check authenticated user
  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        console.error('Auth error:', error);
        navigate('/login');
        return;
      }
      console.log('✅ Authenticated user:', data.user.email);
    };
    checkUser();
  }, [navigate]);
  // 🌐 Always load categories (used in menu form) on mount so select has options
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data, error } = await supabase.from('categories').select('*');
        if (error) throw error;
        setCategories(data || []);
      } catch (err: any) {
        console.error('Failed to load categories:', err.message || err);
        toast.error('فشل تحميل الفئات.', { position: 'top-right', autoClose: 2000 });
      }
    };
    loadCategories();
  }, []);
  // 📦 Fetch data based on active tab
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'menu') {
        const { data, error } = await supabase.from('menu_items').select('*');
        if (error) throw error;
        setMenuItems(data || []);
      } else if (activeTab === 'offers') {
        const { data, error } = await supabase.from('offers').select('*');
        if (error) throw error;
        setOffers(data || []);
      } else if (activeTab === 'categories') {
        const { data, error } = await supabase.from('categories').select('*');
        if (error) throw error;
        setCategories(data || []);
      } else if (activeTab === 'news') {
        const { data, error } = await supabase.from('news').select('*');
        if (error) throw error;
        setNews(data || []);
      } else if (activeTab === 'messages') {
        const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setMessages(data || []);
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(`خطأ: ${err.message}`, {
        position: 'top-right',
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [activeTab]);
  // 📸 Handle image change and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };
  // 📸 Handle image upload
  const handleImageUpload = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `public/${fileName}`;
   
    const { error } = await supabase.storage
      .from('images')
      .upload(filePath, file);
   
    if (error) {
      toast.error(`فشل رفع الصورة: ${error.message}`, {
        position: 'top-right',
        autoClose: 2000,
      });
      throw new Error('Image upload failed: ' + error.message);
    }
    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    toast.success('تم رفع الصورة بنجاح!', {
      position: 'top-right',
      autoClose: 2000,
    });
    return data.publicUrl;
  };
  // ➕ Add or Update item
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let cleanedData = { ...formData };
      // Handle image upload if present
      if (imageFile) {
        cleanedData.image = await handleImageUpload(imageFile);
      }
      if (editingId) {
        // Update existing item
        if (activeTab === 'menu') {
          const { error } = await supabase
            .from('menu_items')
            .update({
              name: formData.name || '',
              category: formData.category || '',
              price_single: parseFloat(formData.price_single) || 0,
              price_double: parseFloat(formData.price_double) || null,
              description: formData.description || '',
              image: cleanedData.image || '',
            })
            .eq('id', editingId);
          if (error) throw error;
          toast.success(`تم تحديث ${formData.name} بنجاح!`, {
            position: 'top-right',
            autoClose: 2000,
          });
        } else if (activeTab === 'offers') {
          const { error } = await supabase
            .from('offers')
            .update({
              title: formData.title || '',
              description: formData.description || '',
              discount: formData.discount || '',
              end_date: formData.end_date || null,
              image: cleanedData.image || '',
            })
            .eq('id', editingId);
          if (error) throw error;
          toast.success(`تم تحديث ${formData.title} بنجاح!`, {
            position: 'top-right',
            autoClose: 2000,
          });
        } else if (activeTab === 'categories') {
          const { error } = await supabase
            .from('categories')
            .update({
              name: formData.name || '',
              icon: formData.icon || '',
            })
            .eq('id', editingId);
          if (error) throw error;
          toast.success(`تم تحديث ${formData.name} بنجاح!`, {
            position: 'top-right',
            autoClose: 2000,
          });
        } else if (activeTab === 'news') {
          const { error } = await supabase
            .from('news')
            .update({
              title: formData.title || '',
              content: formData.content || '',
              image: cleanedData.image || '',
            })
            .eq('id', editingId);
          if (error) throw error;
          toast.success(`تم تحديث ${formData.title} بنجاح!`, {
            position: 'top-right',
            autoClose: 2000,
          });
        }
      } else {
        // Add new item
        if (activeTab === 'menu') {
          const { error } = await supabase.from('menu_items').insert([{
            name: formData.name || '',
            category: formData.category || '',
            price_single: parseFloat(formData.price_single) || 0,
            price_double: parseFloat(formData.price_double) || null,
            description: formData.description || '',
            image: cleanedData.image || '',
          }]);
          if (error) throw error;
          toast.success(`تم إضافة ${formData.name} إلى المنيو بنجاح!`, {
            position: 'top-right',
            autoClose: 2000,
          });
        } else if (activeTab === 'offers') {
          const { error } = await supabase.from('offers').insert([{
            title: formData.title || '',
            description: formData.description || '',
            discount: formData.discount || '',
            end_date: formData.end_date || null,
            image: cleanedData.image || '',
          }]);
          if (error) throw error;
          toast.success(`تم إضافة ${formData.title} إلى العروض بنجاح!`, {
            position: 'top-right',
            autoClose: 2000,
          });
        } else if (activeTab === 'categories') {
          const { error } = await supabase.from('categories').insert([{
            id: crypto.randomUUID(),
            name: formData.name || '',
            icon: formData.icon || '',
          }]);
          if (error) throw error;
          toast.success(`تم إضافة ${formData.name} إلى الفئات بنجاح!`, {
            position: 'top-right',
            autoClose: 2000,
          });
        } else if (activeTab === 'news') {
          const { error } = await supabase.from('news').insert([{
            title: formData.title || '',
            content: formData.content || '',
            image: cleanedData.image || '',
          }]);
          if (error) throw error;
          toast.success(`تم إضافة ${formData.title} إلى الأخبار بنجاح!`, {
            position: 'top-right',
            autoClose: 2000,
          });
        }
      }
      setFormData({});
      setImageFile(null);
      setImagePreview(null);
      setEditingId(null);
      fetchData();
    } catch (err: any) {
      setError(err.message);
      toast.error(`خطأ: ${err.message}`, {
        position: 'top-right',
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };
  // ✏️ Edit item
  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({ ...item });
    setImagePreview(item.image || null);
  };
  // 🗑️ Delete item
  const handleDelete = async (id: string) => {
    setError(null);
    try {
      const tableName = activeTab === 'menu' ? 'menu_items' : activeTab === 'messages' ? 'messages' : activeTab;
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('تم الحذف بنجاح!', {
        position: 'top-right',
        autoClose: 2000,
      });
      fetchData();
    } catch (err: any) {
      setError(err.message);
      toast.error(`خطأ: ${err.message}`, {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };
  return (
    <section className="min-h-screen bg-[#F5F2E9] py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-extrabold text-[#B22222] mb-4">لوحة التحكم</h2>
          <div className="w-32 h-2 bg-[#FFB400] mx-auto rounded-full"></div>
        </motion.div>
        {/* 🔘 Tabs */}
        <div className="flex justify-center flex-wrap gap-4 mb-8">
          {[
            { key: 'menu', label: 'المنيو' },
            { key: 'offers', label: 'العروض' },
            { key: 'categories', label: 'الفئات' },
            { key: 'news', label: 'الأخبار' },
            { key: 'messages', label: 'الرسائل' },
          ].map((tab) => (
            <motion.button
              key={tab.key}
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-[#B22222] text-white shadow-md'
                  : 'bg-white text-[#B22222] border border-[#B22222]'
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
        {/* 🧾 Form */}
        {activeTab !== 'messages' && (
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-3xl shadow-2xl mb-12 border border-[#FFB400]/20"
          >
            {error && <p className="text-red-500 mb-4 text-center font-semibold">{error}</p>}
            {loading ? (
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
                {/* 📸 Improved Image Upload Input with Preview */}
                {(activeTab === 'menu' || activeTab === 'offers' || activeTab === 'news') && (
                  <div className="mb-6">
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center gap-2 px-6 py-4 bg-[#FFB400] text-[#8B0000] rounded-xl font-semibold cursor-pointer hover:bg-[#FFA500] transition-all duration-300 shadow-md"
                    >
                      <Upload size={24} />
                      {imageFile ? imageFile.name : 'اختر صورة'}
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    {imagePreview && (
                      <motion.img
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        src={imagePreview}
                        alt="معاينة الصورة"
                        className="mt-4 w-full h-48 object-cover rounded-xl shadow-lg border border-[#B22222]/20"
                      />
                    )}
                  </div>
                )}
                {activeTab === 'menu' && (
                  <>
                    <motion.input
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      type="text"
                      placeholder="اسم الصنف"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="p-4 rounded-xl border border-[#B22222]/20 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#FFB400] transition-all"
                    />
                    <div className="relative mb-4">
      <motion.button
        type="button"
        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
        className="p-4 rounded-2xl border border-gray-200 w-full bg-white shadow-md 
                   focus:outline-none focus:ring-2 focus:ring-[#FFB400] 
                   flex justify-between items-center text-gray-800 font-semibold
                   hover:shadow-lg transition-all"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <span>
          {formData.category
            ? categories.find(cat => cat.id === formData.category)?.name || 'اختر فئة'
            : 'اختر فئة'}
        </span>
    
        <motion.span
          animate={{ rotate: isCategoryOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-gray-500"
        >
          <ChevronDown size={24} />
        </motion.span>
      </motion.button>
    
      <AnimatePresence>
        {isCategoryOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="absolute left-0 right-0 bg-white border border-gray-200 
                       rounded-2xl shadow-xl mt-2 z-20 max-h-64 overflow-auto overflow-x-hidden backdrop-blur-sm"
          >
            {categories.map((cat) => (
              <motion.li
                key={cat.id}
                whileHover={{
                  scale: 1.01,
                  backgroundColor: "#FFF4D1",
                  color: "#8B0000",
                }}
                transition={{ duration: 0.15 }}
                onClick={() => {
                  setFormData({ ...formData, category: cat.id });
                  setIsCategoryOpen(false);
                }}
                className="p-4 cursor-pointer text-gray-700 font-medium 
                           border-b border-gray-100 last:border-none"
              >
                {cat.name}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
    
                    <motion.input
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      type="number"
                      placeholder="سعر سنجل"
                      value={formData.price_single || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, price_single: e.target.value })
                      }
                      className="p-4 rounded-xl border border-[#B22222]/20 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#FFB400] transition-all"
                    />
                    <motion.input
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      type="number"
                      placeholder="سعر دبل (اختياري)"
                      value={formData.price_double || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, price_double: e.target.value })
                      }
                      className="p-4 rounded-xl border border-[#B22222]/20 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#FFB400] transition-all"
                    />
                    <motion.input
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      type="text"
                      placeholder="الوصف"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="p-4 rounded-xl border border-[#B22222]/20 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#FFB400] transition-all"
                    />
                  </>
                )}
                {activeTab === 'offers' && (
                  <>
                    <motion.input
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      type="text"
                      placeholder="عنوان العرض"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="p-4 rounded-xl border border-[#B22222]/20 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#FFB400] transition-all"
                    />
                    <motion.input
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      type="text"
                      placeholder="الوصف"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="p-4 rounded-xl border border-[#B22222]/20 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#FFB400] transition-all"
                    />
                    <motion.input
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      type="text"
                      placeholder="الخصم"
                      value={formData.discount || ''}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      className="p-4 rounded-xl border border-[#B22222]/20 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#FFB400] transition-all"
                    />
                    <motion.input
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      type="datetime-local"
                      value={formData.end_date || ''}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="p-4 rounded-xl border border-[#B22222]/20 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#FFB400] transition-all"
                    />
                  </>
                )}
                {activeTab === 'categories' && (
                  <>
                    <motion.input
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      type="text"
                      placeholder="اسم الفئة"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="p-4 rounded-xl border border-[#B22222]/20 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#FFB400] transition-all"
                    />
                    <motion.input
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      type="text"
                      placeholder="الأيقونة (اختياري)"
                      value={formData.icon || ''}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="p-4 rounded-xl border border-[#B22222]/20 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#FFB400] transition-all"
                    />
                  </>
                )}
                {activeTab === 'news' && (
                  <>
                    <motion.input
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      type="text"
                      placeholder="عنوان الخبر"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="p-4 rounded-xl border border-[#B22222]/20 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#FFB400] transition-all"
                    />
                    <motion.textarea
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      placeholder="المحتوى"
                      value={formData.content || ''}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="p-4 rounded-xl border border-[#B22222]/20 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#FFB400] transition-all"
                    />
                  </>
                )}
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: '#8B0000' }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-[#B22222] text-white py-4 rounded-xl font-bold hover:bg-[#8B0000] transition-all shadow-md"
                >
                  {editingId ? 'تحديث' : 'إضافة'}
                </motion.button>
              </>
            )}
          </motion.form>
        )}
        {/* 🗂️ Data Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeTab === 'menu' &&
            menuItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, shadow: '0 20px 30px rgba(0,0,0,0.1)' }}
                className="bg-white p-6 rounded-3xl shadow-xl border border-[#FFB400]/10 overflow-hidden"
              >
                <h3 className="text-2xl font-bold text-[#B22222] mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-2">{item.description}</p>
                <p className="font-semibold">سعر سنجل: {item.price_single} جنيه</p>
                {item.price_double && <p className="font-semibold">سعر دبل: {item.price_double} جنيه</p>}
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-xl mt-4 shadow-md"
                  />
                )}
                <div className="mt-6 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleEdit(item)}
                    className="flex-1 bg-[#FFB400] text-white py-2 px-4 rounded-xl hover:bg-[#eba400] font-semibold flex items-center justify-center gap-2"
                  >
                    <Edit size={18} />
                    تعديل
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600 font-semibold flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} />
                    حذف
                  </motion.button>
                </div>
              </motion.div>
            ))}
          {activeTab === 'offers' &&
            offers.map((offer, index) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, shadow: '0 20px 30px rgba(0,0,0,0.1)' }}
                className="bg-white p-6 rounded-3xl shadow-xl border border-[#FFB400]/10 overflow-hidden"
              >
                <h3 className="text-2xl font-bold text-[#B22222] mb-2">{offer.title}</h3>
                <p className="text-gray-600 mb-2">{offer.description}</p>
                <p className="font-semibold">الخصم: {offer.discount}</p>
                {offer.image && (
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-40 object-cover rounded-xl mt-4 shadow-md"
                  />
                )}
                <div className="mt-6 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleEdit(offer)}
                    className="flex-1 bg-[#FFB400] text-white py-2 px-4 rounded-xl hover:bg-[#eba400] font-semibold flex items-center justify-center gap-2"
                  >
                    <Edit size={18} />
                    تعديل
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleDelete(offer.id)}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600 font-semibold flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} />
                    حذف
                  </motion.button>
                </div>
              </motion.div>
            ))}
          {activeTab === 'categories' &&
            categories.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, shadow: '0 20px 30px rgba(0,0,0,0.1)' }}
                className="bg-white p-6 rounded-3xl shadow-xl border border-[#FFB400]/10 overflow-hidden"
              >
                <h3 className="text-2xl font-bold text-[#B22222] mb-2">{cat.name}</h3>
                <p className="text-gray-600">الأيقونة: {cat.icon || '—'}</p>
                <div className="mt-6 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleEdit(cat)}
                    className="flex-1 bg-[#FFB400] text-white py-2 px-4 rounded-xl hover:bg-[#eba400] font-semibold flex items-center justify-center gap-2"
                  >
                    <Edit size={18} />
                    تعديل
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleDelete(cat.id)}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600 font-semibold flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} />
                    حذف
                  </motion.button>
                </div>
              </motion.div>
            ))}
          {activeTab === 'news' &&
            news.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, shadow: '0 20px 30px rgba(0,0,0,0.1)' }}
                className="bg-white p-6 rounded-3xl shadow-xl border border-[#FFB400]/10 overflow-hidden"
              >
                <h3 className="text-2xl font-bold text-[#B22222] mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-2">{item.content}</p>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-40 object-cover rounded-xl mt-4 shadow-md"
                  />
                )}
                <div className="mt-6 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleEdit(item)}
                    className="flex-1 bg-[#FFB400] text-white py-2 px-4 rounded-xl hover:bg-[#eba400] font-semibold flex items-center justify-center gap-2"
                  >
                    <Edit size={18} />
                    تعديل
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600 font-semibold flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} />
                    حذف
                  </motion.button>
                </div>
              </motion.div>
            ))}
            {activeTab === 'messages' &&
            messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, shadow: '0 20px 30px rgba(0,0,0,0.1)' }}
                className="bg-white p-6 rounded-3xl shadow-xl border border-[#FFB400]/10 overflow-hidden"
              >
                <h3 className="text-2xl font-bold text-[#B22222] mb-2">{msg.name}</h3>
                <p className="text-gray-600 mb-2">رقم الهاتف: {msg.phone}</p>
                <p className="text-gray-600 mb-2">الرسالة: {msg.message}</p>
                <p className="text-gray-500 text-sm">التاريخ: {new Date(msg.created_at).toLocaleString('ar-EG')}</p>
                <div className="mt-6 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleDelete(msg.id)}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600 font-semibold flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} />
                    حذف
                  </motion.button>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};