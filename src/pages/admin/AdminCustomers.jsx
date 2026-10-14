import React, { useState, useEffect } from 'react';
import { HeartHandshake, Search, Eye, Phone, Mail, Calendar } from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCust, setSelectedCust] = useState(null);
  const [custDetails, setCustDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/customers', { params: { search } });
      if (res.data?.success) setCustomers(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const viewCustomer = async (cust) => {
    setSelectedCust(cust);
    setLoadingDetails(true);
    try {
      const res = await api.get(`/admin/customers/${cust._id}`);
      if (res.data?.success) setCustDetails(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#252124]">
            Client &amp; Loyalty Directory
          </h1>
          <p className="text-xs text-[#252124]/60 font-light mt-1">
            Track guest visit frequency, lifetime revenue, and styling notes.
          </p>
        </div>

        <div className="w-full sm:w-64 relative">
          <Search className="w-4 h-4 text-[#252124]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guest or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#F2DDE1] text-xs focus:outline-none focus:border-[#572A39] bg-white"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#F2DDE1] shadow-xs overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading client profiles..." />
        ) : customers.length === 0 ? (
          <EmptyState title="No Clients Found" message="No guests matched your search." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#252124]/60 uppercase tracking-wider font-semibold border-b border-[#F2DDE1]">
                <tr>
                  <th className="py-3.5 px-4">Guest Name</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Bookings</th>
                  <th className="py-3.5 px-4">Lifetime Spent</th>
                  <th className="py-3.5 px-4">Last Visit</th>
                  <th className="py-3.5 px-4 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2DDE1]/60">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-[#252124]">{c.fullName}</td>
                    <td className="py-3.5 px-4 text-[#252124]/75">{c.phone}</td>
                    <td className="py-3.5 px-4 text-[#252124]/75">{c.email}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-[#FAF7F2] text-[#572A39] px-2 py-0.5 rounded-full font-bold">
                        {c.totalBookings}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-[#572A39]">
                      ₹{Number(c.totalSpent).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-[#252124]/60">
                      {new Date(c.lastVisit).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => viewCustomer(c)}
                        className="text-xs text-[#572A39] hover:underline font-semibold cursor-pointer"
                      >
                        History →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drawer */}
      {selectedCust && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#F2DDE1] shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F2DDE1] pb-3">
              <div>
                <h3 className="font-serif text-2xl font-normal text-[#252124]">
                  {selectedCust.fullName}
                </h3>
                <p className="text-xs text-[#252124]/60">
                  {selectedCust.phone} • {selectedCust.email}
                </p>
              </div>
              <button onClick={() => setSelectedCust(null)}>✕</button>
            </div>

            {loadingDetails ? (
              <LoadingSpinner size="sm" text="Retrieving visit history..." />
            ) : (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 bg-[#FAF7F2] rounded-xl border border-[#F2DDE1]">
                  <div>
                    <span className="text-[10px] uppercase text-[#572A39] font-semibold block">
                      Total Visits
                    </span>
                    <span className="font-serif text-xl font-bold">
                      {selectedCust.totalBookings}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#572A39] font-semibold block">
                      Lifetime Spend
                    </span>
                    <span className="font-serif text-xl font-bold text-[#572A39]">
                      ₹{Number(selectedCust.totalSpent).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-serif text-lg font-normal mb-2">Past Appointments</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {custDetails?.appointments?.map((a) => (
                      <div
                        key={a._id}
                        className="p-2.5 rounded-lg border border-[#F2DDE1] flex justify-between"
                      >
                        <div>
                          <strong>{a.bookingReference}</strong>
                          <p className="text-[11px] text-[#252124]/60">
                            {a.appointmentDate} at {a.salonLocation?.name}
                          </p>
                        </div>
                        <span className="font-serif font-bold text-[#572A39]">
                          ₹{Number(a.totalPrice).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="pt-2 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setSelectedCust(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
