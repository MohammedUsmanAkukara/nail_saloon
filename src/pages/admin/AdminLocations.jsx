import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Trash2, Phone, Mail, ExternalLink } from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const DEFAULT_HOURS = [
  { day: 'Monday', open: '10:00 AM', close: '08:30 PM', isClosed: false },
  { day: 'Tuesday', open: '10:00 AM', close: '08:30 PM', isClosed: false },
  { day: 'Wednesday', open: '10:00 AM', close: '08:30 PM', isClosed: false },
  { day: 'Thursday', open: '10:00 AM', close: '08:30 PM', isClosed: false },
  { day: 'Friday', open: '10:00 AM', close: '09:00 PM', isClosed: false },
  { day: 'Saturday', open: '10:00 AM', close: '09:00 PM', isClosed: false },
  { day: 'Sunday', open: '10:00 AM', close: '08:30 PM', isClosed: false },
];

const AdminLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLoc, setEditingLoc] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    city: '',
    state: 'Maharashtra',
    address: '',
    phone: '',
    email: '',
    mapEmbedUrl: '',
    coverImage: '',
    active: true,
    openingHours: DEFAULT_HOURS,
  });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/locations/admin/all');
      if (res.data?.success) setLocations(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const openCreateModal = () => {
    setEditingLoc(null);
    setFormData({
      name: '',
      slug: '',
      city: 'Mumbai',
      state: 'Maharashtra',
      address: '',
      phone: '+91 (022) ',
      email: '',
      mapEmbedUrl: '',
      coverImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80',
      active: true,
      openingHours: DEFAULT_HOURS,
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEditModal = (loc) => {
    setEditingLoc(loc);
    setFormData({
      name: loc.name,
      slug: loc.slug,
      city: loc.city,
      state: loc.state || '',
      address: loc.address,
      phone: loc.phone,
      email: loc.email || '',
      mapEmbedUrl: loc.mapEmbedUrl || '',
      coverImage: loc.coverImage || '',
      active: !!loc.active,
      openingHours: loc.openingHours?.length ? loc.openingHours : DEFAULT_HOURS,
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      if (editingLoc) {
        await api.patch(`/locations/admin/${editingLoc._id}`, formData);
      } else {
        await api.post('/locations/admin/create', formData);
      }
      setModalOpen(false);
      fetchLocations();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error saving location.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this studio location?')) return;
    try {
      await api.delete(`/locations/admin/${id}`);
      fetchLocations();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting location.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#252124]">
            Salon Studio Locations
          </h1>
          <p className="text-xs text-[#252124]/60 font-light mt-1">
            Manage multi-city boutique addresses, schedules, and Google Maps references.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={openCreateModal}>
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Studio Location
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-[#F2DDE1] shadow-xs overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Retrieving salon locations..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#252124]/60 uppercase tracking-wider font-semibold border-b border-[#F2DDE1]">
                <tr>
                  <th className="py-3.5 px-4">Studio</th>
                  <th className="py-3.5 px-4">City</th>
                  <th className="py-3.5 px-4">Address</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2DDE1]/60">
                {locations.map((loc) => (
                  <tr key={loc._id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={loc.coverImage}
                          alt={loc.name}
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />
                        <div>
                          <strong className="block text-sm font-medium text-[#252124]">
                            {loc.name}
                          </strong>
                          <span className="text-[11px] text-[#252124]/50 font-mono">
                            /{loc.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#572A39]">{loc.city}</td>
                    <td className="py-3.5 px-4 text-[#252124]/75 max-w-xs truncate">
                      {loc.address}
                    </td>
                    <td className="py-3.5 px-4 text-[#252124]/75">{loc.phone}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          loc.active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {loc.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(loc)}
                          className="p-1.5 text-gray-500 hover:text-[#572A39] hover:bg-[#FAF7F2] rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(loc._id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-[#F2DDE1] shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2DDE1] pb-3">
              <h3 className="font-serif text-2xl font-normal text-[#252124]">
                {editingLoc ? 'Edit Salon Studio' : 'Create New Salon Studio'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-black">
                ✕
              </button>
            </div>

            {errorMsg && <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg">{errorMsg}</p>}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                    Studio Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
                  />
                </div>
                <div>
                  <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
                  />
                </div>
              </div>

              <div>
                <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                  Full Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                    Telephone *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
                  />
                </div>
                <div>
                  <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
                  />
                </div>
              </div>

              <div>
                <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
                />
              </div>

              <div>
                <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                  Google Maps Embed URL
                </label>
                <input
                  type="text"
                  value={formData.mapEmbedUrl}
                  onChange={(e) => setFormData({ ...formData, mapEmbedUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="accent-[#572A39]"
                  />
                  <span>Active &amp; Open for Appointments</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#F2DDE1] flex justify-end gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={saving}>
                  Save Studio
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLocations;
