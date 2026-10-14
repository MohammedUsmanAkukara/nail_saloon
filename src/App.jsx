import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import ErrorBoundary from './components/common/ErrorBoundary';

// Layouts
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Services from './pages/public/Services';
import ServiceDetail from './pages/public/ServiceDetail';
import Pricing from './pages/public/Pricing';
import Gallery from './pages/public/Gallery';
import BookAppointment from './pages/public/BookAppointment';
import Locations from './pages/public/Locations';
import LocationDetail from './pages/public/LocationDetail';
import Team from './pages/public/Team';
import Reviews from './pages/public/Reviews';
import GiftCards from './pages/public/GiftCards';
import Blog from './pages/public/Blog';
import BlogArticle from './pages/public/BlogArticle';
import Contact from './pages/public/Contact';
import FAQ from './pages/public/FAQ';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import Terms from './pages/public/Terms';
import BookingConfirmation from './pages/public/BookingConfirmation';
import NotFound from './pages/public/NotFound';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminOverview from './pages/admin/AdminOverview';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminServices from './pages/admin/AdminServices';
import AdminLocations from './pages/admin/AdminLocations';
import AdminGallery from './pages/admin/AdminGallery';
import AdminStaff from './pages/admin/AdminStaff';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminBlog from './pages/admin/AdminBlog';
import AdminGiftCards from './pages/admin/AdminGiftCards';
import AdminNewsletter from './pages/admin/AdminNewsletter';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminSettings from './pages/admin/AdminSettings';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <ErrorBoundary>
            <Routes>
              {/* Public Customer Website */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="services" element={<Services />} />
                <Route path="services/:slug" element={<ServiceDetail />} />
                <Route path="pricing" element={<Pricing />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="book" element={<BookAppointment />} />
                <Route path="locations" element={<Locations />} />
                <Route path="locations/:slug" element={<LocationDetail />} />
                <Route path="team" element={<Team />} />
                <Route path="reviews" element={<Reviews />} />
                <Route path="gift-cards" element={<GiftCards />} />
                <Route path="blog" element={<Blog />} />
                <Route path="blog/:slug" element={<BlogArticle />} />
                <Route path="contact" element={<Contact />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="privacy" element={<PrivacyPolicy />} />
                <Route path="terms" element={<Terms />} />
                <Route path="booking/confirmation/:reference" element={<BookingConfirmation />} />
                <Route path="booking/lookup" element={<BookingConfirmation />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Admin Login */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin Suite */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminOverview />} />
                <Route path="appointments" element={<AdminAppointments />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="locations" element={<AdminLocations />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="staff" element={<AdminStaff />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="gift-cards" element={<AdminGiftCards />} />
                <Route path="newsletter" element={<AdminNewsletter />} />
                <Route path="enquiries" element={<AdminEnquiries />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>
            </Routes>
          </ErrorBoundary>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
