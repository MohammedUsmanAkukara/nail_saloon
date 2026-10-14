import React, { useState, useEffect } from 'react';
import { HelpCircle, Mail, Phone, Clock, CheckCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [status, setStatus] = useState('new');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await api.get('/enquiries/admin/all');
      if (res.data?.success) setEnquiries(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const openManage = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setStatus(enquiry.status || 'new');
    setNotes(enquiry.internalNotes || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedEnquiry) return;
    setUpdating(true);
    try {
      await api.patch(`/enquiries/admin/${selectedEnquiry._id}`, {
        status,
        internalNotes: notes,
      });
      setSelectedEnquiry(null);
      fetchEnquiries();
    } catch (err) {
      alert('Error updating inquiry status.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-normal text-[#252124]">
          Customer Inquiries &amp; Consultations
        </h1>
        <p className="text-xs text-[#252124]/60 font-light mt-1">
          Review bridal requests, custom commissions, and general salon questions.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#F2DDE1] shadow-xs overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Retrieving customer messages..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#252124]/60 uppercase tracking-wider font-semibold border-b border-[#F2DDE1]">
                <tr>
                  <th className="py-3.5 px-4">Guest</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Message</th>
                  <th className="py-3.5 px-4">Preferred Studio</th>
                  <th className="py-3.5 px-4">Received</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2DDE1]/60">
                {enquiries.map((e) => (
                  <tr key={e._id} className="hover:bg-[#FAF7F2]/60">
                    <td className="py-3.5 px-4">
                      <strong className="block text-[#252124]">{e.name}</strong>
                      <span className="text-[11px] text-[#252124]/60">
                        {e.email} • {e.phone}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#572A39]">{e.subject}</td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-[#252124]/75">
                      {e.message}
                    </td>
                    <td className="py-3.5 px-4 text-[#252124]/60">
                      {e.preferredLocation?.name || 'Any Studio'}
                    </td>
                    <td className="py-3.5 px-4 text-[#252124]/60">
                      {new Date(e.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          e.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : e.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openManage(e)}
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
      </div>

      {/* Detail / Status Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#F2DDE1] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2DDE1] pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C98F9A] font-semibold">
                  Client Message
                </span>
                <h3 className="font-serif text-2xl font-normal text-[#252124]">
                  {selectedEnquiry.name}
                </h3>
              </div>
              <button onClick={() => setSelectedEnquiry(null)}>✕</button>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#F2DDE1] space-y-2 text-xs">
              <p>
                <strong>Email:</strong> {selectedEnquiry.email} | <strong>Phone:</strong>{' '}
                {selectedEnquiry.phone}
              </p>
              <p>
                <strong>Subject:</strong> {selectedEnquiry.subject}
              </p>
              <p className="pt-1 text-[#252124]/85 leading-relaxed">"{selectedEnquiry.message}"</p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div>
                <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] bg-white cursor-pointer"
                >
                  <option value="new">New</option>
                  <option value="in_progress">In Progress / Contacted</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                  Internal Concierge Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Quoted bridal package for 6 guests at Bandra studio..."
                  className="w-full p-2.5 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEnquiry(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={updating}>
                  Save Status
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEnquiries;
