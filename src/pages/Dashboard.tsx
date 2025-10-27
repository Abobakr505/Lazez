import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { MenuItem, Offer, Category } from '../types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // استيراد react-toastify
import { Upload } from 'lucide-react'; // استيراد أيقونة Upload

export const Dashboard = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'menu' | 'offers' | 'news' | 'categories'>('menu');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
  };

  // 🗑️ Delete item
  const handleDelete = async (id: string) => {
    setError(null);
    try {
      const tableName = activeTab === 'menu' ? 'menu_items' : activeTab;
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
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          {loading ? (

          <div className="flex justify-center items-center flex-col gap-6 h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-[#B22222] border-t-transparent rounded-full"
            ></motion.div>
            <p className="text-gray-700 text-lg">جاري تحميل المنتجات...</p>
          </div>          ) : (
            <>
              {/* 📸 Improved Image Upload Input */}
              {(activeTab === 'menu' || activeTab === 'offers' || activeTab === 'news') && (
                <div className="mb-4">
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#FFB400] text-[#8B0000] rounded-lg font-semibold cursor-pointer hover:bg-[#FFA500] transition-colors duration-200"
                  >
                    <Upload size={20} />
                    {imageFile ? imageFile.name : 'اختر صورة'}
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </div>
              )}

              {activeTab === 'menu' && (
                <>
                  <input
                    type="text"
                    placeholder="اسم الصنف"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="p-3 rounded-lg border w-full mb-4"
                  />
                  <select
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="p-3 rounded-lg border w-full mb-4"
                  >
                    <option value="">اختر فئة</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="سعر سنجل"
                    value={formData.price_single || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, price_single: e.target.value })
                    }
                    className="p-3 rounded-lg border w-full mb-4"
                  />
                  <input
                    type="number"
                    placeholder="سعر دبل (اختياري)"
                    value={formData.price_double || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, price_double: e.target.value })
                    }
                    className="p-3 rounded-lg border w-full mb-4"
                  />
                  <input
                    type="text"
                    placeholder="الوصف"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="p-3 rounded-lg border w-full mb-4"
                  />
                </>
              )}

              {activeTab === 'offers' && (
                <>
                  <input
                    type="text"
                    placeholder="عنوان العرض"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="p-3 rounded-lg border w-full mb-4"
                  />
                  <input
                    type="text"
                    placeholder="الوصف"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="p-3 rounded-lg border w-full mb-4"
                  />
                  <input
                    type="text"
                    placeholder="الخصم"
                    value={formData.discount || ''}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="p-3 rounded-lg border w-full mb-4"
                  />
                  <input
                    type="datetime-local"
                    value={formData.end_date || ''}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="p-3 rounded-lg border w-full mb-4"
                  />
                </>
              )}

              {activeTab === 'categories' && (
                <>
                  <input
                    type="text"
                    placeholder="اسم الفئة"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="p-3 rounded-lg border w-full mb-4"
                  />
                  <input
                    type="text"
                    placeholder="الأيقونة (اختياري)"
                    value={formData.icon || ''}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="p-3 rounded-lg border w-full mb-4"
                  />
                </>
              )}

              {activeTab === 'news' && (
                <>
                  <input
                    type="text"
                    placeholder="عنوان الخبر"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="p-3 rounded-lg border w-full mb-4"
                  />
                  <textarea
                    placeholder="المحتوى"
                    value={formData.content || ''}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="p-3 rounded-lg border w-full mb-4"
                  />
                </>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-[#B22222] text-white py-3 rounded-lg font-bold hover:bg-[#8B0000]"
              >
                {editingId ? 'تحديث' : 'إضافة'}
              </motion.button>
            </>
          )}
        </form>

        {/* 🗂️ Data Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeTab === 'menu' &&
            menuItems.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-[#B22222]">{item.name}</h3>
                <p>{item.description}</p>
                <p>سعر سنجل: {item.price_single} جنيه</p>
                {item.price_double && <p>سعر دبل: {item.price_double} جنيه</p>}
                {item.image && <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-lg mt-4" />}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-[#FFB400] text-white py-2 px-4 rounded-lg hover:bg-[#eba400]"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}

          {activeTab === 'offers' &&
            offers.map((offer) => (
              <div key={offer.id} className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-[#B22222]">{offer.title}</h3>
                <p>{offer.description}</p>
                <p>الخصم: {offer.discount}</p>
                {offer.image && <img src={offer.image} alt={offer.title} className="w-full h-32 object-cover rounded-lg mt-4" />}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(offer)}
                    className="bg-[#FFB400] text-white py-2 px-4 rounded-lg hover:bg-[#eba400]"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(offer.id)}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}

          {activeTab === 'categories' &&
            categories.map((cat) => (
              <div key={cat.id} className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-[#B22222]">{cat.name}</h3>
                <p>الأيقونة: {cat.icon || '—'}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="bg-[#FFB400] text-white py-2 px-4 rounded-lg hover:bg-[#eba400]"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}

          {activeTab === 'news' &&
            news.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-[#B22222]">{item.title}</h3>
                <p>{item.content}</p>
                {item.image && <img src={item.image} alt={item.title} className="w-full h-32 object-cover rounded-lg mt-4" />}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-[#FFB400] text-white py-2 px-4 rounded-lg hover:bg-[#eba400]"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};