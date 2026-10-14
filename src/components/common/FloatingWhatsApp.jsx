import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const FloatingWhatsApp = ({ customMessage }) => {
  const { settings } = useSettings();
  const phone = settings.contactInfo?.whatsappNumber || '919876543210';
  const defaultText =
    customMessage ||
    'Hello Nail Salon & Spa! I would like to inquire about booking an appointment or custom nail art.';

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(defaultText)}`;

  return (
    <aside aria-label="WhatsApp Concierge" className="fixed bottom-6 right-6 z-50 group">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Salon Concierge on WhatsApp"
        className="flex items-center gap-3 bg-[#25D366] text-white p-3.5 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-semibold tracking-wide pr-0 group-hover:pr-2">
          Concierge on WhatsApp
        </span>
      </a>
    </aside>
  );
};

export default FloatingWhatsApp;
