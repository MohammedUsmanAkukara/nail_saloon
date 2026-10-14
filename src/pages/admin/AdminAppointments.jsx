import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Search,
  Filter,
  Download,
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Eye,
} from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';

const STATUSES = ['all', 'confirmed', 'pending', 'completed', 'cancelled', 'no-show'];

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [status, setStatus] = useState('all');
  const [locationId, setLocationId] = useState('all');
  const [date, setDate] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Selected for drawer / action
  const [activeAppt, setActiveAppt] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (status !== 'all') params.status = status;
      if (locationId !== 'all') params.locationId = locationId;
      if (date) params.date = date;
      if (search) params.search = search;

      const res = await api.get('/appointments/admin/all', { params });
      if (res.data?.success) {
        setAppointments(res.data.data);
        setTotalPages(res.data.totalPages || 1);
        setTotal(res.data.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await api.get('/locations');
        if (res.data?.success) setLocations(res.data.data);
      } catch (e) {
        // ignore
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [status, locationId, date, search, page]);

  const handleUpdateStatus = async (apptId, newStatus, newPaymentStatus) => {
    setUpdating(true);
    setStatusFeedback('');
    try {
      const payload = {};
      if (newStatus) payload.status = newStatus;
      if (newPaymentStatus) payload.paymentStatus = newPaymentStatus;

      const res = await api.patch(`/appointments/admin/${apptId}/status`, payload);
      if (res.data?.success) {
        setStatusFeedback(`Updated successfully.`);
        fetchAppointments();
        if (activeAppt && activeAppt._id === apptId) {
          setActiveAppt(res.data.data);
        }
      }
    } catch (err) {
      setStatusFeedback(err.response?.data?.message || 'Update failed.');
    } finally {
      setUpdating(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      window.open('/api/appointments/admin/export', '_blank');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#252124]">
            Appointment Management
          </h1>
          <p className="text-xs text-[#252124]/60 font-light mt-1">
            Total records: {total} reservations across all salons.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={handleExportCSV}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export CSV
          </Button>
          <Link to="/book" target="_blank">
            <Button variant="primary" size="sm">
              + New Appointment
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#F2DDE1] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#252124]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reference, guest or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#F2DDE1] text-xs focus:outline-none focus:border-[#572A39]"
            />
          </div>

          {/* Location Filter */}
          <div>
            <select
              value={locationId}
              onChange={(e) => {
                setLocationId(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] text-xs focus:outline-none focus:border-[#572A39] bg-white cursor-pointer"
            >
              <option value="all">All Studio Locations</option>
              {locations.map((l) => (
                <option key={l._id} value={l._id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] text-xs focus:outline-none focus:border-[#572A39] bg-white cursor-pointer"
            />
          </div>

          {/* Reset Filters */}
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStatus('all');
                setLocationId('all');
                setDate('');
                setSearch('');
                setPage(1);
              }}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pt-2 border-t border-[#F2DDE1]/60 no-scrollbar">
          {STATUSES.map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatus(st);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider font-semibold transition-all whitespace-nowrap cursor-pointer ${
                status === st
                  ? 'bg-[#572A39] text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-[#252124]/70 hover:bg-[#F2DDE1]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments Data Table */}
      <div className="bg-white rounded-2xl border border-[#F2DDE1] shadow-xs overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading appointment records..." />
        ) : appointments.length === 0 ? (
          <EmptyState
            title="No Appointments Found"
            message="No reservations match the specified filters or date criteria."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#252124]/60 uppercase tracking-wider font-semibold border-b border-[#F2DDE1]">
                <tr>
                  <th className="py-3.5 px-4">Booking Ref</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Salon Studio</th>
                  <th className="py-3.5 px-4">Appointment Time</th>
                  <th className="py-3.5 px-4">Services</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2DDE1]/60">
                {appointments.map((appt) => (
                  <tr key={appt._id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#572A39]">
                      {appt.bookingReference}
                    </td>
                    <td className="py-3.5 px-4">
                      <strong className="block text-[#252124] font-medium">
                        {appt.customer?.fullName}
                      </strong>
                      <span className="text-[11px] text-[#252124]/60 font-light">
                        {appt.customer?.phone}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#252124]/75">
                      {appt.salonLocation?.name || 'Studio'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="block font-medium text-[#252124]">
                        {appt.appointmentDate}
                      </span>
                      <span className="text-[11px] text-[#572A39] font-light">
                        {appt.startTime} – {appt.endTime} ({appt.totalDuration}m)
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="line-clamp-1 max-w-[150px] text-[#252124]/80">
                        {appt.services?.map((s) => s.name).join(', ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-[#252124]">
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
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setActiveAppt(appt)}
                        className="text-xs text-[#572A39] hover:underline font-semibold cursor-pointer"
                      >
                        Manage →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#F2DDE1] flex items-center justify-between text-xs">
            <span className="text-[#252124]/60 font-light">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Appointment Detail & Status Modal Drawer */}
      {activeAppt && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#F2DDE1] space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#F2DDE1] pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C98F9A] font-semibold">
                  Reservation Detail
                </span>
                <h3 className="font-serif text-2xl font-normal text-[#252124]">
                  {activeAppt.bookingReference}
                </h3>
              </div>
              <button
                onClick={() => setActiveAppt(null)}
                className="text-gray-400 hover:text-black"
              >
                ✕
              </button>
            </div>

            {statusFeedback && (
              <p className="text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                {statusFeedback}
              </p>
            )}

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#F2DDE1] space-y-1">
                <p>
                  <strong>Guest:</strong> {activeAppt.customer?.fullName} (
                  {activeAppt.customer?.phone} • {activeAppt.customer?.email})
                </p>
                <p>
                  <strong>Studio:</strong> {activeAppt.salonLocation?.name}
                </p>
                <p>
                  <strong>Time:</strong> {activeAppt.appointmentDate} ({activeAppt.startTime} –{' '}
                  {activeAppt.endTime})
                </p>
                {activeAppt.customerNotes && (
                  <p className="italic text-[#572A39]">
                    "Guest Note: {activeAppt.customerNotes}"
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider font-semibold text-[#572A39] block mb-1.5">
                  Update Appointment Status:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={activeAppt.status === 'confirmed' ? 'primary' : 'secondary'}
                    size="sm"
                    disabled={updating}
                    onClick={() => handleUpdateStatus(activeAppt._id, 'confirmed')}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant={activeAppt.status === 'completed' ? 'primary' : 'secondary'}
                    size="sm"
                    disabled={updating}
                    onClick={() => handleUpdateStatus(activeAppt._id, 'completed', 'paid')}
                  >
                    Mark Completed
                  </Button>
                  <Button
                    variant={activeAppt.status === 'cancelled' ? 'danger' : 'secondary'}
                    size="sm"
                    disabled={updating}
                    onClick={() => handleUpdateStatus(activeAppt._id, 'cancelled')}
                  >
                    Cancel Slot
                  </Button>
                  <Button
                    variant={activeAppt.status === 'no-show' ? 'danger' : 'secondary'}
                    size="sm"
                    disabled={updating}
                    onClick={() => handleUpdateStatus(activeAppt._id, 'no-show')}
                  >
                    Mark No-Show
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setActiveAppt(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;
