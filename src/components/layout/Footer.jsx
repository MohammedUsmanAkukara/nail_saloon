import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import api from '../../services/api';

const Footer = () => {
  const { settings } = useSettings();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      const res = await api.post('/newsletter/subscribe', { email });
      setSubscribed(true);
      setMessage(res.data.message || 'Thank you for subscribing to The Sobo Gazette.');
      setEmail('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Subscription failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#252124] text-[#FAF7F2] pt-20 pb-12 border-t border-[#3A3539]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-16 border-b border-[#3A3539]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl tracking-[0.08em] text-[#FAF7F2] leading-none">
                NAIL SALON
              </span>
              <span className="block text-[10px] tracking-[0.3em] text-[#C98F9A] uppercase font-semibold mt-1">
                &amp; Spa
              </span>
            </Link>
            <p className="text-sm text-[#FAF7F2]/70 font-light leading-relaxed max-w-sm">
              A bespoke nail-art atelier and sanctuary for modern women. Combining European hard gel sculpting, Russian dry manicure precision, and non-toxic Japanese formulations.
            </p>
            <div className="pt-2">
              <p className="text-xs text-[#D8BE9A] uppercase tracking-widest font-semibold mb-2">
                Salon Concierge
              </p>
              <div className="flex flex-col gap-2 text-sm text-[#FAF7F2]/80 font-light">
                <a
                  href={`tel:${settings.contactInfo?.phone || '+9102226408901'}`}
                  className="flex items-center gap-2 hover:text-[#D8BE9A] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#C98F9A]" />
                  {settings.contactInfo?.phone || '+91 (022) 2640-8901'}
                </a>
                <a
                  href={`mailto:${settings.contactInfo?.email || 'concierge@nailsalonandspa.com'}`}
                  className="flex items-center gap-2 hover:text-[#D8BE9A] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#C98F9A]" />
                  {settings.contactInfo?.email || 'concierge@nailsalonandspa.com'}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D8BE9A]">
              Experience
            </h4>
            <ul className="space-y-2.5 text-sm font-light text-[#FAF7F2]/75">
              <li>
                <Link to="/services" className="hover:text-[#FAF7F2] transition-colors">
                  Services &amp; Rituals
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-[#FAF7F2] transition-colors">
                  Treatment Pricing
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#FAF7F2] transition-colors">
                  Nail Art Lookbook
                </Link>
              </li>
              <li>
                <Link to="/locations" className="hover:text-[#FAF7F2] transition-colors">
                  Salon Locations
                </Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-[#FAF7F2] transition-colors">
                  Master Nail Artists
                </Link>
              </li>
              <li>
                <Link to="/gift-cards" className="hover:text-[#FAF7F2] transition-colors">
                  Gift Cards
                </Link>
              </li>
            </ul>
          </div>

          {/* Salon Studios */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D8BE9A]">
              Studios
            </h4>
            <ul className="space-y-3 text-sm font-light text-[#FAF7F2]/75">
              <li>
                <Link to="/locations/bandra-west" className="block hover:text-[#FAF7F2]">
                  <strong className="block text-[#FAF7F2] font-normal">Bandra West, Mumbai</strong>
                  <span className="text-xs text-[#FAF7F2]/50">Pali Hill Road</span>
                </Link>
              </li>
              <li>
                <Link to="/locations/colaba-heritage" className="block hover:text-[#FAF7F2]">
                  <strong className="block text-[#FAF7F2] font-normal">Colaba Heritage, Mumbai</strong>
                  <span className="text-xs text-[#FAF7F2]/50">Near Gateway of India</span>
                </Link>
              </li>
              <li>
                <Link to="/locations/indiranagar-bengaluru" className="block hover:text-[#FAF7F2]">
                  <strong className="block text-[#FAF7F2] font-normal">Indiranagar, Bengaluru</strong>
                  <span className="text-xs text-[#FAF7F2]/50">100 Feet Road</span>
                </Link>
              </li>
              <li className="pt-1">
                <Link to="/book" className="text-xs text-[#C98F9A] uppercase tracking-wider font-semibold hover:underline">
                  Find Nearest Studio →
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D8BE9A]">
              The Sobo Gazette
            </h4>
            <p className="text-xs text-[#FAF7F2]/70 font-light leading-relaxed">
              Curated seasonal palettes, secret trunk-show openings, and VIP priority booking slots.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-[#572A39]/40 border border-[#C98F9A]/30 rounded-lg text-xs text-[#FAF7F2]">
                <CheckCircle2 className="w-4 h-4 text-[#D8BE9A] shrink-0" />
                <span>{message}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full bg-[#1A1719] border border-[#3A3539] focus:border-[#C98F9A] rounded-full px-4 py-2.5 text-xs text-white placeholder-[#FAF7F2]/30 focus:outline-none pr-10"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    aria-label="Subscribe"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#572A39] hover:bg-[#C98F9A] text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {message && <p className="text-[11px] text-[#C98F9A]">{message}</p>}
              </form>
            )}

            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-widest text-[#FAF7F2]/40 block mb-2 font-medium">
                Follow The Atelier
              </span>
              <div className="flex gap-3 text-[#FAF7F2]/70">
                <a
                  href={settings.socialLinks?.instagram || 'https://instagram.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-[#3A3539] flex items-center justify-center hover:text-[#D8BE9A] hover:border-[#D8BE9A] transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
                <a
                  href={settings.socialLinks?.facebook || 'https://facebook.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-[#3A3539] flex items-center justify-center hover:text-[#D8BE9A] hover:border-[#D8BE9A] transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-[#FAF7F2]/50">
          <p>© {new Date().getFullYear()} Nail Salon &amp; Spa. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/privacy" className="hover:text-[#FAF7F2] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-[#FAF7F2] transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link to="/faq" className="hover:text-[#FAF7F2] transition-colors">
              FAQ
            </Link>
            <Link to="/admin/login" className="text-[#C98F9A] hover:text-[#FAF7F2] transition-colors font-medium">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
