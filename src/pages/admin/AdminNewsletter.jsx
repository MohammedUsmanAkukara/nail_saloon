import React, { useState, useEffect } from 'react';
import { Mail, Download, Search } from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/newsletter/admin/all');
      if (res.data?.success) setSubscribers(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleExportCSV = () => {
    window.open('/api/newsletter/admin/export', '_blank');
  };

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#252124]">
            Newsletter Subscribers
          </h1>
          <p className="text-xs text-[#252124]/60 font-light mt-1">
            Total active subscribers: {subscribers.filter((s) => s.active).length}
          </p>
        </div>

        <Button variant="secondary" size="sm" onClick={handleExportCSV}>
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Export CSV
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-[#F2DDE1] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#F2DDE1] max-w-sm">
          <input
            type="text"
            placeholder="Search subscriber email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] text-xs focus:outline-none focus:border-[#572A39]"
          />
        </div>

        {loading ? (
          <LoadingSpinner text="Retrieving subscriber list..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#252124]/60 uppercase tracking-wider font-semibold border-b border-[#F2DDE1]">
                <tr>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Subscribed Date</th>
                  <th className="py-3.5 px-4">Source</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2DDE1]/60">
                {filtered.map((s) => (
                  <tr key={s._id} className="hover:bg-[#FAF7F2]/60">
                    <td className="py-3.5 px-4 font-medium text-[#252124]">{s.email}</td>
                    <td className="py-3.5 px-4 text-[#252124]/75">
                      {new Date(s.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-[#252124]/60">{s.source || 'Website'}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          s.active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {s.active ? 'Active' : 'Unsubscribed'}
                      </span>
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

export default AdminNewsletter;
