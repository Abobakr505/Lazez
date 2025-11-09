import { useState } from "react";
import { Headset, X, Menu, ClipboardList , PhoneCall  } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

// تهيئة Fancybox
const initializeFancybox = () => {
  Fancybox.bind("[data-fancybox]", {
    // خيارات Fancybox
    closeButton: "top",
    dragToClose: true,
    wheel: "slide",
    Thumbs: false,
    Toolbar: {
      autoEnable: true,
      items: {
        zoom: { enabled: true },
        download: { enabled: true },
        close: { enabled: true },
      },
    },
  });
};

export function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const phoneNumber = "201023142309";
  const message = encodeURIComponent("مرحبا، اريد عمل اوردر من لذيذ ");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    const telephone = `tel:${phoneNumber}`;


  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5, y: 10 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    }),
    exit: { opacity: 0, scale: 0.5, y: 10, transition: { duration: 0.3 } },
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="relative flex flex-col items-center">
        <AnimatePresence>
          {open && (
            <div className="flex flex-col items-center mb-4 space-y-4">
              {[
                {
                  Icon: PhoneCall ,
                  label: " اتصل بنا",
                  href: telephone,
                },
                {
                  Icon: FaWhatsapp,
                  label: "دردشة واتساب",
                  href: whatsappUrl,
                },
                {
                  Icon: ClipboardList,
                  label: "عرض المنيو",
                  onClick: () => {
                    Fancybox.show([
                      { src: "/menu1.jpg", type: "image" },
                      { src: "/menu2.jpg", type: "image" },
                    ]);
                  },
                },
              ].map((item, index) => {
                const Component = item.href ? motion.a : motion.button;
                return (
                  <Component
                    key={item.label}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={iconVariants}
                    href={item.href}
                    target={item.href && item.label.includes("واتساب") ? "_blank" : undefined}
                    rel={item.href && item.label.includes("واتساب") ? "noopener noreferrer" : undefined}
                    onClick={item.onClick}
                    data-fancybox={item.dataFancybox}
                    aria-label={item.label}
                    whileHover={{ scale: 1.2, boxShadow: "0 0 15px rgba(255, 180, 0, 0.5)" }}
                    whileTap={{ scale: 0.9 }}
                    className="relative group bg-gradient-to-r from-[#FFB400] to-[#ffb60c] rounded-full p-3 shadow-lg"
                  >
                    <item.Icon className="h-6 w-6 text-[#B22222]" />
                    <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#FFB400] text-[#B22222] text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap shadow-md font-bold">
                      {item.label}
                    </span>
                  </Component>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "إغلاق خيارات الدعم" : "تواصل معنا"}
          className="bg-gradient-to-r from-[#FFB400] to-[#ffb60c] text-[#B22222] p-4 rounded-full shadow-2xl focus:outline-none"
          whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(255, 180, 0, 0.6)" }}
          whileTap={{ scale: 0.9 }}
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          {open ? <X className="h-6 w-6" /> : <Headset className="h-6 w-6" />}
        </motion.button>
      </div>
    </div>
  );
}