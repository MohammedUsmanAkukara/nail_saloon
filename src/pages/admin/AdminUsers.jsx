import React, { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, Edit2, Lock } from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ROLES = ['superadmin', 'admin', 'manager', 'receptionist', 'artist'];

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    assignedLocations: [],
  });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [uRes, lRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/locations'),
      ]);
      if (uRes.data?.success) setUsers(uRes.data.data);
      if (lRes.data?.success) setLocations(lRes.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      await api.post('/admin/users', formData);
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error creating user account.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (id === user.id) {
      alert('You cannot delete your active session account.');
      return;
    }
    if (!window.confirm('Delete this administrator profile?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting user.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#252124]">
            User Roles &amp; Access Control
          </h1>
          <p className="text-xs text-[#252124]/60 font-light mt-1">
            RBAC permissions for Superadmins, Salon Managers, and Receptionists.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setFormData({
              name: '',
              email: '',
              password: '',
              role: 'manager',
              assignedLocations: locations.length ? [locations[0]._id] : [],
            });
            setErrorMsg('');
            setModalOpen(true);
          }}
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Create Admin User
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-[#F2DDE1] shadow-xs overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Retrieving administrative users..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#252124]/60 uppercase tracking-wider font-semibold border-b border-[#F2DDE1]">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Assigned Locations</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2DDE1]/60">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-[#FAF7F2]/60">
                    <td className="py-3.5 px-4">
                      <strong className="block text-[#252124]">{u.name}</strong>
                      <span className="text-[11px] text-[#252124]/60">{u.email}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-[#FAF7F2] text-[#572A39] border border-[#F2DDE1] px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#252124]/75">
                      {u.assignedLocations?.length > 0 ? (
                        u.assignedLocations.map((l) => l.name).join(', ')
                      ) : (
                        <span className="text-gray-400">All Locations (Global)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {u.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {u._id !== user.id && (
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#F2DDE1] shadow-2xl space-y-4">
            <h3 className="font-serif text-2xl font-normal text-[#252124]">
              Create Admin Account
            </h3>
            {errorMsg && <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{errorMsg}</p>}
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                  Full Name *
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
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
                />
              </div>

              <div>
                <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                  Password (min 6 characters) *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
                />
              </div>

              <div>
                <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                  Role Permission *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] bg-white cursor-pointer"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-[#F2DDE1] flex justify-end gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={saving}>
                  Create User
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
