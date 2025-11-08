import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { MenuSection } from '../components/MenuSection';
import { OffersSection } from '../components/OffersSection';
import { AboutSection } from '../components/AboutSection';
import { ContactSection } from '../components/ContactSection';
import { Cart } from '../components/Cart';
import { Footer } from '../components/Footer';
import { useCart } from '../hooks/useCart';
import { WhatsAppButton } from '../components/WhatsAppButton';

export const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        // small delay to ensure elements are mounted
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50);
      }
    }
  }, [location]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, addToCart, updateQuantity, removeFromCart, getTotal, getWhatsAppMessage } = useCart();

  // Memoize cartItemsCount to avoid unnecessary recalculations
  const cartItemsCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  return (
    <div className="min-h-screen bg-white">
      <Header
        cartItemsCount={cartItemsCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      <Hero />
      <MenuSection onAddToCart={addToCart} />
      <OffersSection />
      <AboutSection />
      <ContactSection />
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