import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2, Edit2, Sparkles } from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const CATEGORIES = ['Minimal', 'French Tips', 'Chrome', 'Floral', 'Bridal', 'Glitter', '3D Art', 'Seasonal Trends'];

const AdminGallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'Minimal',
    featured: false,
    active: true,
  });
  const [saving, setSaving] = useState(false);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await api.get('/gallery/admin/all');
      if (res.data?.success) setItems(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
      category: 'Chrome',
      featured: true,
      active: true,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        await api.patch(`/gallery/admin/${editingItem._id}`, formData);
      } else {
        await api.post('/gallery/admin/create', formData);
      }
      setModalOpen(false);
      fetchGallery();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving image.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete artwork from gallery?')) return;
    try {
      await api.delete(`/gallery/admin/${id}`);
      fetchGallery();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting artwork.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#252124]">
            Nail Art Portfolio Manager
          </h1>
          <p className="text-xs text-[#252124]/60 font-light mt-1">
            Upload, categorize, and feature bespoke nail art photographs.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={openCreateModal}>
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Artwork
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner text="Retrieving gallery..." />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-[#F2DDE1] overflow-hidden shadow-xs flex flex-col justify-between group"
            >
              <div className="aspect-square relative overflow-hidden bg-[#FAF7F2]">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-2 left-2 text-[10px] bg-black/70 text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                  {item.category}
                </span>
                {item.featured && (
                  <span className="absolute top-2 right-2 text-[10px] bg-[#572A39] text-[#FAF7F2] px-2 py-0.5 rounded-full font-bold">
                    ★
                  </span>
                )}
              </div>
              <div className="p-4 space-y-2">
                <h4 className="font-serif text-base font-normal text-[#252124] line-clamp-1">
                  {item.title}
                </h4>
                <div className="flex items-center justify-between pt-2 border-t border-[#F2DDE1]/60">
                  <span className="text-[10px] text-gray-500">
                    {item.active ? 'Active' : 'Hidden'}
                  </span>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#F2DDE1] shadow-2xl space-y-4">
            <h3 className="font-serif text-2xl font-normal text-[#252124]">
              {editingItem ? 'Edit Artwork' : 'Add Nail Art Image'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                  Artwork Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
                />
              </div>

              <div>
                <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
                ></textarea>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="accent-[#572A39]"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#F2DDE1] flex justify-end gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={saving}>
                  Save Artwork
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
