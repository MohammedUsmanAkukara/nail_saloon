import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWhatsApp from '../common/FloatingWhatsApp';

const Layout = () => {
  const { pathname } = useLocation();

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#252124] selection:bg-[#F2DDE1] selection:text-[#572A39]">
      <Navbar />
      <main className="flex-grow pt-[100px] md:pt-[110px]">
        <Outlet />
      </main>
      <FloatingWhatsApp />
      <Footer />
    </div>
  );
};

export default Layout;
