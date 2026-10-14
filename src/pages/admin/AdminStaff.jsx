import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Award, MapPin } from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const AdminStaff = () => {
  const [staff, setStaff] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    role: 'Senior Nail Artist',
    bio: '',
    avatar: '',
    email: '',
    phone: '',
    experienceYears: 4,
    assignedLocations: [],
    featured: true,
    active: true,
  });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [staffRes, locRes] = await Promise.all([
        api.get('/staff/admin/all'),
        api.get('/locations'),
      ]);
      if (staffRes.data?.success) setStaff(staffRes.data.data);
      if (locRes.data?.success) setLocations(locRes.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingStaff(null);
    setFormData({
      name: '',
      role: 'Senior Nail Artist',
      bio: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      email: '',
      phone: '',
      experienceYears: 4,
      assignedLocations: locations.length ? [locations[0]._id] : [],
      featured: true,
      active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (st) => {
    setEditingStaff(st);
    setFormData({
      name: st.name,
      role: st.role,
      bio: st.bio || '',
      avatar: st.avatar || '',
      email: st.email || '',
      phone: st.phone || '',
      experienceYears: st.experienceYears || 3,
      assignedLocations: st.assignedLocations?.map((l) => l._id || l) || [],
      featured: !!st.featured,
      active: !!st.active,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingStaff) {
        await api.patch(`/staff/admin/${editingStaff._id}`, formData);
      } else {
        await api.post('/staff/admin/create', formData);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving staff member.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this technician profile?')) return;
    try {
      await api.delete(`/staff/admin/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting staff.');
    }
  };

  const toggleLocation = (locId) => {
    if (formData.assignedLocations.includes(locId)) {
      setFormData({
        ...formData,
        assignedLocations: formData.assignedLocations.filter((id) => id !== locId),
      });
    } else {
      setFormData({
        ...formData,
        assignedLocations: [...formData.assignedLocations, locId],
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#252124]">
            Artists &amp; Technicians
          </h1>
          <p className="text-xs text-[#252124]/60 font-light mt-1">
            Manage resident salon nail technicians, studio assignments, and bios.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={openCreateModal}>
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Technician
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-[#F2DDE1] shadow-xs overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Retrieving team..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#252124]/60 uppercase tracking-wider font-semibold border-b border-[#F2DDE1]">
                <tr>
                  <th className="py-3.5 px-4">Artist</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Experience</th>
                  <th className="py-3.5 px-4">Assigned Studios</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2DDE1]/60">
                {staff.map((st) => (
                  <tr key={st._id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={st.avatar}
                          alt={st.name}
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                        <div>
                          <strong className="block text-sm font-medium text-[#252124]">
                            {st.name}
                          </strong>
                          <span className="text-[11px] text-[#252124]/50">{st.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#572A39]">{st.role}</td>
                    <td className="py-3.5 px-4 text-[#252124]/75">
                      {st.experienceYears}+ years
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {st.assignedLocations?.map((loc) => (
                          <span
                            key={loc._id || loc}
                            className="bg-[#FAF7F2] text-[#572A39] border border-[#F2DDE1] px-2 py-0.5 rounded-full text-[10px]"
                          >
                            {loc.name ? loc.name.split('-')[1]?.trim() || loc.name : 'Studio'}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          st.active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {st.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(st)}
                          className="p-1.5 text-gray-500 hover:text-[#572A39] hover:bg-[#FAF7F2] rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(st._id)}
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#F2DDE1] shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="font-serif text-2xl font-normal text-[#252124]">
              {editingStaff ? 'Edit Artist Profile' : 'Add Nail Artist'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                    Name *
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
                    Role Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
                  />
                </div>
              </div>

              <div>
                <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                  Avatar Photo URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
                />
              </div>

              <div>
                <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                  Biography &amp; Background
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
                ></textarea>
              </div>

              <div>
                <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1.5">
                  Assigned Salon Locations:
                </label>
                <div className="space-y-1.5">
                  {locations.map((loc) => (
                    <label key={loc._id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.assignedLocations.includes(loc._id)}
                        onChange={() => toggleLocation(loc._id)}
                        className="accent-[#572A39]"
                      />
                      <span>
                        {loc.name} ({loc.city})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#F2DDE1] flex justify-end gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={saving}>
                  Save Artist
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStaff;
