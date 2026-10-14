import React, { useState, useEffect } from 'react';
import { MessageSquare, Check, X, Star, ShieldCheck, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const AdminTestimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/testimonials/admin/all');
      if (res.data?.success) setReviews(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggle = async (id, field, currentValue) => {
    try {
      await api.patch(`/testimonials/admin/${id}`, { [field]: !currentValue });
      fetchReviews();
    } catch (e) {
      alert('Error updating review status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete review?')) return;
    try {
      await api.delete(`/testimonials/admin/${id}`);
      fetchReviews();
    } catch (e) {
      alert('Error deleting review.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-normal text-[#252124]">
          Review Moderation &amp; Testimonials
        </h1>
        <p className="text-xs text-[#252124]/60 font-light mt-1">
          Approve customer submissions, verify appointments, and toggle homepage features.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#F2DDE1] shadow-xs overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Retrieving reviews..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#252124]/60 uppercase tracking-wider font-semibold border-b border-[#F2DDE1]">
                <tr>
                  <th className="py-3.5 px-4">Guest</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Review Text</th>
                  <th className="py-3.5 px-4">Studio / Service</th>
                  <th className="py-3.5 px-4">Moderation</th>
                  <th className="py-3.5 px-4">Verified</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2DDE1]/60">
                {reviews.map((r) => (
                  <tr key={r._id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-[#252124]">{r.customerName}</td>
                    <td className="py-3.5 px-4 text-amber-500 font-bold">★ {r.rating}/5</td>
                    <td className="py-3.5 px-4 max-w-sm truncate text-[#252124]/80">
                      "{r.reviewText}"
                    </td>
                    <td className="py-3.5 px-4 text-[#252124]/60">
                      {r.locationName} • {r.serviceName}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggle(r._id, 'approved', r.approved)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase cursor-pointer ${
                          r.approved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.approved ? 'Approved' : 'Pending'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggle(r._id, 'verified', r.verified)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer ${
                          r.verified ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {r.verified ? 'Verified' : 'Unverified'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggle(r._id, 'featured', r.featured)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer ${
                          r.featured ? 'bg-[#572A39] text-white' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {r.featured ? 'Featured' : 'Standard'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTestimonials;
