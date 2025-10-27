import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Home, Box, Phone, ClipboardList, Newspaper } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

export const Header = ({ cartItemsCount, onCartClick }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  // Animation Variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const menuVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 20,
        when: 'beforeChildren',
        staggerChildren: 0.12,
      },
    },
    exit: { x: '100%', opacity: 0, transition: { duration: 0.3 } },
  };

  const linkVariants = {
    hidden: { x: 30, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  const links = [
    { name: 'الرئيسية', id: 'hero', icon: <Home size={18} /> },
    { name: 'المنيو', id: 'menu', icon: <ClipboardList  size={18} /> },
    { name: 'العروض', id: 'offers', icon: <Newspaper  size={18} /> },
    { name: 'من نحن', id: 'about', icon: <Home size={18} /> },
    { name: 'تواصل معنا', id: 'contact', icon: <Phone size={18} /> },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#B22222] to-[#8B0000] shadow-lg"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="Lalezar text-[#FFB400] font-bold text-2xl cursor-pointer text-shadow-lg"
            onClick={() => scrollToSection('hero')}
          >
            لــذيــذ 🍔
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link, i) => (
              <a
                key={i}
                onClick={() => scrollToSection(link.id)}
                className="nav-link text-white hover:text-[#FFB400] transition-colors font-semibold"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCartClick}
              className="relative p-2 bg-[#FFB400] rounded-lg text-[#8B0000] hover:bg-[#FFA500] transition-colors shadow-sm hover:shadow-md"
            >
              <ShoppingCart size={24} />
              {cartItemsCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-white text-[#B22222] font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#B22222]"
                >
                  {cartItemsCount}
                </motion.span>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={backdropVariants}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer Menu */}
            <motion.nav
              key="mobile-menu"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
              className="fixed top-0 right-0 w-3/4 h-full bg-gradient-to-b from-[#B22222] to-[#8B0000] shadow-2xl rounded-l-2xl p-6 z-50 md:hidden flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="self-end p-2 text-[#FFB400] hover:text-white"
              >
                <X size={24} />
              </button>

              {/* Links */}
              <div className="flex flex-col space-y-6 mt-8">
                {links.map((link, i) => (
                  <motion.div key={i} variants={linkVariants}>
                    <a
                      onClick={() => scrollToSection(link.id)}
                      className="flex items-center gap-3 text-lg font-semibold text-white hover:text-[#FFB400] transition-colors"
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};