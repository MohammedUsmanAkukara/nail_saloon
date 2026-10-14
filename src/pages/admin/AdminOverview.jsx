import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  MapPin,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import api from '../../services/api';

const AdminOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/admin/analytics');
      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Aggregating database analytics..." />;
  }

  const stats = data?.stats || {};
  const recent = data?.recentAppointments || [];
  const topServices = data?.topServices || [];
  const locations = data?.locationDistribution || [];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#252124]">
            Atelier Executive Overview
          </h1>
          <p className="text-xs text-[#252124]/60 font-light mt-1">
            Real-time appointment capacity, confirmed reservations, and service revenue.
          </p>
        </div>

        <div className="flex gap-3">
          <Link to="/admin/appointments">
            <Button variant="primary" size="sm">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              Manage Bookings
            </Button>
          </Link>
          <Link to="/book" target="_blank">
            <Button variant="secondary" size="sm">
              New Booking →
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#F2DDE1] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#572A39]">
              Total Bookings
            </span>
            <Calendar className="w-4 h-4 text-[#C98F9A]" />
          </div>
          <span className="font-serif text-3xl font-bold text-[#252124]">
            {stats.totalAppointments || 0}
          </span>
          <p className="text-[11px] text-[#252124]/60 mt-1 font-light">
            Today: <strong>{stats.todayAppointments || 0} scheduled</strong>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F2DDE1] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#572A39]">
              Completed Revenue
            </span>
            <TrendingUp className="w-4 h-4 text-[#C98F9A]" />
          </div>
          <span className="font-serif text-3xl font-bold text-[#572A39]">
            ₹{Number(stats.totalRevenue || 0).toLocaleString('en-IN')}
          </span>
          <p className="text-[11px] text-[#252124]/60 mt-1 font-light">From verified visits</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F2DDE1] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#572A39]">
              Confirmed Active
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-serif text-3xl font-bold text-emerald-700">
            {stats.confirmedCount || 0}
          </span>
          <p className="text-[11px] text-[#252124]/60 mt-1 font-light">
            Pending: {stats.pendingCount || 0}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F2DDE1] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#572A39]">
              Unique Guests
            </span>
            <Users className="w-4 h-4 text-[#C98F9A]" />
          </div>
          <span className="font-serif text-3xl font-bold text-[#252124]">
            {stats.totalCustomers || 0}
          </span>
          <p className="text-[11px] text-[#252124]/60 mt-1 font-light">
            Across {stats.totalLocations || 3} salons
          </p>
        </div>
      </div>

      {/* Middle Grid: Top Services & Studio Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most-Booked Rituals */}
        <div className="bg-white p-6 rounded-2xl border border-[#F2DDE1] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F2DDE1] pb-3">
            <h3 className="font-serif text-xl font-normal text-[#252124]">
              Top In-Demand Rituals
            </h3>
            <span className="text-[10px] uppercase tracking-wider text-[#C98F9A] font-semibold">
              By Session Volume
            </span>
          </div>

          {topServices.length === 0 ? (
            <p className="text-xs text-[#252124]/50 py-4 text-center">
              No service volume records yet.
            </p>
          ) : (
            <div className="space-y-3">
              {topServices.map((svc, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-2">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#FAF7F2] text-[#572A39] font-bold flex items-center justify-center font-serif text-xs">
                      {i + 1}
                    </span>
                    <span className="font-medium text-[#252124]">{svc._id}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[#252124]/60">{svc.count} bookings</span>
                    <span className="font-serif font-semibold text-[#572A39]">
                      ₹{Number(svc.totalRevenue).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Salon Studios Footfall */}
        <div className="bg-white p-6 rounded-2xl border border-[#F2DDE1] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F2DDE1] pb-3">
            <h3 className="font-serif text-xl font-normal text-[#252124]">
              Studio Distribution
            </h3>
            <span className="text-[10px] uppercase tracking-wider text-[#C98F9A] font-semibold">
              Active Locations
            </span>
          </div>

          <div className="space-y-3">
            {locations.map((loc, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-[#FAF7F2] border border-[#F2DDE1] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C98F9A]" />
                  <div>
                    <h4 className="font-medium text-[#252124]">{loc.name || 'Studio'}</h4>
                    <span className="text-[10px] text-[#252124]/50">{loc.city}</span>
                  </div>
                </div>
                <span className="font-serif text-lg font-bold text-[#572A39]">
                  {loc.count} visits
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Table: Recent Bookings */}
      <div className="bg-white rounded-2xl border border-[#F2DDE1] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#F2DDE1] flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-normal text-[#252124]">
              Recent Atelier Bookings
            </h3>
            <p className="text-xs text-[#252124]/60 font-light">
              Latest incoming reservations across all salon locations.
            </p>
          </div>
          <Link
            to="/admin/appointments"
            className="text-xs font-semibold text-[#572A39] hover:underline flex items-center gap-1"
          >
            All Appointments <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-[#252124]/60 uppercase tracking-wider font-semibold border-b border-[#F2DDE1]">
              <tr>
                <th className="py-3 px-4">Ref Code</th>
                <th className="py-3 px-4">Guest</th>
                <th className="py-3 px-4">Studio</th>
                <th className="py-3 px-4">Date &amp; Time</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2DDE1]/60">
              {recent.map((appt) => (
                <tr key={appt._id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-[#572A39]">
                    {appt.bookingReference}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#252124]">
                    {appt.customer?.fullName}
                  </td>
                  <td className="py-3.5 px-4 text-[#252124]/75">
                    {appt.salonLocation?.name ? appt.salonLocation.name.split('-')[1]?.trim() || appt.salonLocation.name : 'Studio'}
                  </td>
                  <td className="py-3.5 px-4 text-[#252124]/75">
                    {appt.appointmentDate} • {appt.startTime}
                  </td>
                  <td className="py-3.5 px-4 font-serif font-semibold text-[#252124]">
                    ₹{Number(appt.totalPrice).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                        appt.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : appt.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : appt.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {appt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
