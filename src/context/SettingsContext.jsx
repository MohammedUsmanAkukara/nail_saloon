import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    announcement: {
      text: 'Your next nail obsession starts here. Complimentary organic rose tea with every appointment.',
      enabled: true,
      link: '/book',
    },
    hero: {
      headline: 'Your Nails.\nYour Art.\nYour Moment.',
      subheadline: 'Discover exceptional nail artistry, bespoke gel extensions, thoughtful cuticle care, and a little everyday luxury.',
      primaryCtaText: 'Book Your Appointment',
      secondaryCtaText: 'Explore Our Services',
      heroImage: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=80',
      badgeText: 'NAIL SALON & SPA EXPERIENCE • MUMBAI & BENGALURU',
    },
    contactInfo: {
      phone: '+91 (022) 2640-8901',
      email: 'concierge@nailsalonandspa.com',
      whatsappNumber: '919876543210',
      headquartersAddress: 'Pali Hill, Bandra West, Mumbai 400050',
      businessHours: 'Mon - Sun: 10:00 AM – 08:30 PM',
    },
    socialLinks: {
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com',
      pinterest: 'https://pinterest.com',
    },
    bookingRules: {
      currencySymbol: '₹',
    },
  });
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings/public');
      if (res.data?.success && res.data.data) {
        setSettings(res.data.data);
      }
    } catch (err) {
      console.warn('Could not load dynamic settings, using defaults:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings: fetchSettings,
        announcementVisible: settings.announcement?.enabled && !announcementDismissed,
        dismissAnnouncement: () => setAnnouncementDismissed(true),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
