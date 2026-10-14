import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, Phone, Sparkles, ChevronDown } from 'lucide-react';
import Button from '../common/Button';
import AnnouncementBar from '../common/AnnouncementBar';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Nail Art', path: '/gallery' },
  { label: 'Locations', path: '/locations' },
  { label: 'Team', path: '/team' },
  { label: 'About', path: '/about' },
  { label: 'Journal', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 w-full z-40 transition-all duration-300">
      <AnnouncementBar />

      <nav
        className={`w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#FAF7F2]/95 backdrop-blur-md shadow-sm border-b border-[#F2DDE1]/60 py-3'
            : 'bg-[#FAF7F2]/80 backdrop-blur-sm py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex flex-col items-start group">
            <span className="font-serif text-2xl sm:text-3xl font-normal tracking-[0.08em] text-[#252124] group-hover:text-[#572A39] transition-colors leading-none">
              NAIL SALON
            </span>
            <span className="text-[10px] tracking-[0.3em] text-[#C98F9A] uppercase font-semibold mt-1">
              &amp; Spa
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-xs uppercase tracking-[0.14em] font-medium transition-all duration-200 relative py-1 hover:text-[#572A39] ${
                    isActive
                      ? 'text-[#572A39] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#572A39]'
                      : 'text-[#252124]/80 hover:text-[#572A39]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden sm:flex items-center gap-4">
            <Link to="/book">
              <Button variant="primary" size="md">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                Book Appointment
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-3 lg:hidden">
            <Link to="/book" className="sm:hidden">
              <Button variant="primary" size="sm">
                Book
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#252124] hover:text-[#572A39] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[90px] bg-[#FAF7F2] z-40 px-6 py-8 flex flex-col justify-between overflow-y-auto border-t border-[#F2DDE1]">
          <div className="flex flex-col gap-5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-lg font-serif tracking-wider uppercase transition-colors py-1 ${
                    isActive ? 'text-[#572A39] font-bold pl-2 border-l-2 border-[#572A39]' : 'text-[#252124]/90'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="pt-4 border-t border-[#F2DDE1] flex flex-col gap-3">
              <Link to="/gift-cards" className="text-sm text-[#572A39] font-medium tracking-wide">
                ✨ Gift Cards &amp; Experiences
              </Link>
              <Link to="/reviews" className="text-sm text-[#252124]/80 hover:text-[#572A39]">
                Client Reviews &amp; Stories
              </Link>
              <Link to="/faq" className="text-sm text-[#252124]/80 hover:text-[#572A39]">
                Frequently Asked Questions
              </Link>
              <Link to="/admin/login" className="text-xs text-[#C98F9A] uppercase tracking-widest mt-2">
                Staff &amp; Admin Portal →
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#F2DDE1]">
            <Link to="/book" className="w-full block">
              <Button variant="primary" size="lg" className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Book Your Appointment
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
