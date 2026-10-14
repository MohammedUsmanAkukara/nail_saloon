import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Lock, Mail, Sparkles, Shield, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@nailsalonandspa.com');
  const [password, setPassword] = useState('Password@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Invalid credentials. Please verify your email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Card */}
        <div className="text-center mb-8">
          <span className="font-serif text-3xl sm:text-4xl tracking-[0.08em] text-[#252124] block leading-none">
            NAIL SALON &amp; SPA
          </span>
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C98F9A] font-semibold mt-1 block">
            Management &amp; Atelier Portal
          </span>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#F2DDE1] shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#572A39] flex items-center justify-center mx-auto mb-3 border border-[#F2DDE1]">
              <Lock className="w-5 h-5 text-[#572A39]" />
            </div>
            <h2 className="font-serif text-2xl font-normal text-[#252124]">
              Staff &amp; Admin Sign In
            </h2>
            <p className="text-xs text-[#252124]/60 font-light">
              Enter your authorized staff credentials to access salon operations.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#C98F9A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F2DDE1] text-xs sm:text-sm focus:outline-none focus:border-[#572A39] bg-[#FAF7F2]/40"
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#C98F9A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F2DDE1] text-xs sm:text-sm focus:outline-none focus:border-[#572A39] bg-[#FAF7F2]/40"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={loading}
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="pt-4 border-t border-[#F2DDE1] text-center">
            <span className="text-[10px] uppercase tracking-wider text-[#252124]/50 block mb-2 font-semibold">
              Default Demonstration Logins:
            </span>
            <div className="flex flex-col gap-1.5 text-xs text-[#252124]/75">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@nailsalonandspa.com');
                  setPassword('Password@123');
                }}
                className="hover:text-[#572A39] underline text-left sm:text-center cursor-pointer"
              >
                <strong>Superadmin:</strong> admin@nailsalonandspa.com (Password@123)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('manager.bandra@nailsalonandspa.com');
                  setPassword('Password@123');
                }}
                className="hover:text-[#572A39] underline text-left sm:text-center cursor-pointer"
              >
                <strong>Salon Manager:</strong> manager.bandra@nailsalonandspa.com (Password@123)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
