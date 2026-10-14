import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Edit2, Trash2, Clock, Check, X, Search } from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    shortDescription: '',
    fullDescription: '',
    coverImage: '',
    duration: 60,
    basePrice: 2000,
    featured: false,
    active: true,
    locationPricing: [],
  });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [servRes, catRes, locRes] = await Promise.all([
        api.get('/services/admin/all'),
        api.get('/services/categories'),
        api.get('/locations'),
      ]);
      if (servRes.data?.success) setServices(servRes.data.data);
      if (catRes.data?.success) setCategories(catRes.data.data);
      if (locRes.data?.success) setLocations(locRes.data.data);
    } catch (err) {
      console.error('Failed to load services data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      name: '',
      slug: '',
      category: categories[0]?._id || '',
      shortDescription: '',
      fullDescription: '',
      coverImage: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
      duration: 60,
      basePrice: 2500,
      featured: false,
      active: true,
      locationPricing: [],
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      slug: service.slug,
      category: service.category?._id || service.category,
      shortDescription: service.shortDescription || '',
      fullDescription: service.fullDescription || '',
      coverImage: service.coverImage || '',
      duration: service.duration,
      basePrice: service.basePrice,
      featured: !!service.featured,
      active: !!service.active,
      locationPricing: service.locationPricing || [],
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      if (editingService) {
        await api.patch(`/services/admin/${editingService._id}`, formData);
      } else {
        await api.post('/services/admin/create', formData);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error saving service.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/services/admin/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting service.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#252124]">
            Service &amp; Ritual Catalog
          </h1>
          <p className="text-xs text-[#252124]/60 font-light mt-1">
            Manage treatments, baseline pricing, durations, and studio-specific rates.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={openCreateModal}>
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add New Treatment
        </Button>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-[#F2DDE1] shadow-xs overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading service catalog..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#252124]/60 uppercase tracking-wider font-semibold border-b border-[#F2DDE1]">
                <tr>
                  <th className="py-3.5 px-4">Treatment</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Base Price</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2DDE1]/60">
                {services.map((svc) => (
                  <tr key={svc._id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={svc.coverImage}
                          alt={svc.name}
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />
                        <div>
                          <strong className="block text-sm font-medium text-[#252124]">
                            {svc.name}
                          </strong>
                          <span className="text-[11px] text-[#252124]/50 font-mono">
                            /{svc.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#252124]/75">
                      {svc.category?.name || 'Category'}
                    </td>
                    <td className="py-3.5 px-4 text-[#252124]/75">{svc.duration} mins</td>
                    <td className="py-3.5 px-4 font-serif font-bold text-[#572A39]">
                      ₹{Number(svc.basePrice).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      {svc.featured ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          YES
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[10px]">NO</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          svc.active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {svc.active ? 'Active' : 'Archived'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(svc)}
                          className="p-1.5 text-gray-500 hover:text-[#572A39] hover:bg-[#FAF7F2] rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(svc._id)}
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

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-[#F2DDE1] shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2DDE1] pb-3">
              <h3 className="font-serif text-2xl font-normal text-[#252124]">
                {editingService ? 'Edit Treatment Ritual' : 'Create New Treatment'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-black">
                ✕
              </button>
            </div>

            {errorMsg && <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg">{errorMsg}</p>}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                    Treatment Name *
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
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] bg-white cursor-pointer focus:outline-none focus:border-[#572A39]"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                    Base Price (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
                  />
                </div>
                <div>
                  <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                    Duration (Minutes) *
                  </label>
                  <input
                    type="number"
                    required
                    min={15}
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
                  />
                </div>
              </div>

              <div>
                <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                  Cover Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
                />
              </div>

              <div>
                <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                  Short Summary *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
                ></textarea>
              </div>

              <div>
                <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                  Full Description &amp; Lore
                </label>
                <textarea
                  rows={3}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
                ></textarea>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="accent-[#572A39]"
                  />
                  <span>Featured On Homepage</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="accent-[#572A39]"
                  />
                  <span>Active &amp; Bookable</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#F2DDE1] flex justify-end gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={saving}>
                  Save Treatment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
