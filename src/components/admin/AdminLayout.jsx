import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Sparkles,
  MapPin,
  Image as ImageIcon,
  Users,
  HeartHandshake,
  MessageSquare,
  BookOpen,
  Gift,
  Mail,
  HelpCircle,
  Sliders,
  Shield,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const navItems = [
  { label: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Appointments', path: '/admin/appointments', icon: Calendar },
  { label: 'Services', path: '/admin/services', icon: Sparkles },
  { label: 'Salon Studios', path: '/admin/locations', icon: MapPin },
  { label: 'Nail Art Gallery', path: '/admin/gallery', icon: ImageIcon },
  { label: 'Staff & Artists', path: '/admin/staff', icon: Users },
  { label: 'Client Directory', path: '/admin/customers', icon: HeartHandshake },
  { label: 'Reviews & Feedback', path: '/admin/testimonials', icon: MessageSquare },
  { label: 'Beauty Journal', path: '/admin/blog', icon: BookOpen },
  { label: 'Gift Cards', path: '/admin/gift-cards', icon: Gift },
  { label: 'Newsletter', path: '/admin/newsletter', icon: Mail },
  { label: 'Inquiries', path: '/admin/enquiries', icon: HelpCircle },
  { label: 'Website CMS', path: '/admin/settings', icon: Sliders },
  { label: 'User Roles & RBAC', path: '/admin/users', icon: Shield, superadminOnly: true },
];

const AdminLayout = () => {
  const { user, isAuthenticated, loading, logout, hasRole } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <LoadingSpinner text="Authenticating atelier credentials..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F7F4EF] flex text-[#252124]">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#252124] text-[#FAF7F2] shrink-0 border-r border-[#3A3539]">
        {/* Brand Header */}
        <div className="p-6 border-b border-[#3A3539] flex items-center justify-between">
          <Link to="/admin" className="flex flex-col">
            <span className="font-serif text-base tracking-[0.08em] text-white leading-tight">NAIL SALON &amp; SPA</span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#C98F9A] font-semibold mt-0.5">
              Admin Suite
            </span>
          </Link>
          <span className="text-[10px] bg-[#572A39] text-[#FAF7F2] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
            {user.role}
          </span>
        </div>

        {/* Navigation items */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
          {navItems.map((item) => {
            if (item.superadminOnly && !hasRole('superadmin')) return null;

            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#572A39] text-white shadow-sm font-semibold'
                      : 'text-[#FAF7F2]/70 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 text-[#C98F9A]" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* User profile & Logout */}
        <div className="p-4 border-t border-[#3A3539] bg-[#1A1719] flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#572A39] text-white flex items-center justify-center font-serif text-xs font-bold shrink-0">
              {user.name?.charAt(0) || 'A'}
            </div>
            <div className="truncate">
              <p className="text-xs font-medium text-white truncate">{user.name}</p>
              <p className="text-[10px] text-[#FAF7F2]/50 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#F2DDE1] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-[#252124] hover:text-[#572A39]"
              aria-label="Toggle navigation drawer"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#252124]/60">
              <span>Management Suite</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#C98F9A]" />
              <span className="font-semibold text-[#572A39]">Live Salon Operations</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#572A39] hover:text-[#431E2A] font-semibold tracking-wide bg-[#FAF7F2] px-3.5 py-1.5 rounded-full border border-[#F2DDE1]"
            >
              <span>View Public Atelier</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs text-red-600 hover:text-red-800 font-medium sm:hidden flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </header>

        {/* Mobile Drawer */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="w-64 h-full bg-[#252124] text-white flex flex-col p-4 space-y-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="font-serif text-base tracking-wider">NAIL SALON &amp; SPA ADMIN</span>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1 pt-2">
                {navItems.map((item) => {
                  if (item.superadminOnly && !hasRole('superadmin')) return null;
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.exact}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-xl text-xs ${
                          isActive ? 'bg-[#572A39] text-white' : 'text-white/70'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 text-[#C98F9A]" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Nested Admin Page Outlet */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
