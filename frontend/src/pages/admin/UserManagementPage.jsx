import React, { useState, useEffect } from 'react';
import { userService } from '../../services/dashboardService';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, Search, Users, AlertCircle, CheckCircle } from 'lucide-react';

export const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { user: currentUser } = useAuth();
  const { success, error: toastError } = useToast();
  const isAdmin = currentUser?.role === 'admin';

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;

      const res = await userService.getUsers(params);
      if (res.data?.users) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('[Users] Error loading user directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers();
    }, 250);
    return () => clearTimeout(delay);
  }, [search, roleFilter, statusFilter]);

  const handleRoleChange = async (userId, targetRole) => {
    try {
      await userService.updateUserRole(userId, targetRole);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: targetRole } : u))
      );
      success(`User role updated to ${targetRole}`);
    } catch (err) {
      toastError(err.response?.data?.error?.message || 'Failed to update role');
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await userService.updateUserStatus(userId, nextStatus);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: nextStatus } : u))
      );
      success(`Account set to ${nextStatus}`);
    } catch (err) {
      toastError(err.response?.data?.error?.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
          Governance & Permissions
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-forest">
          User & Team Directory
        </h2>
        <p className="text-xs sm:text-sm text-brand-muted mt-1">
          {isAdmin
            ? 'Manage enterprise member permissions, elevate roles, and control account activation status'
            : 'View active organization team members and project participants'}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-brand-border shadow-subtle">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-brand-border text-xs sm:text-sm text-brand-forest bg-brand-ivory/30 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full md:w-36 px-3 py-2 rounded-xl border border-brand-border text-xs sm:text-sm text-brand-forest bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="member">Member</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-36 px-3 py-2 rounded-xl border border-brand-border text-xs sm:text-sm text-brand-forest bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      {loading ? (
        <LoadingSkeleton count={1} type="table" />
      ) : (
        <div className="bg-white rounded-3xl border border-brand-border shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-brand-forest">
              <thead className="bg-brand-ivory border-b border-brand-border text-brand-muted uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined Date</th>
                  {isAdmin && <th className="px-6 py-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {users.map((u) => {
                  const isSelf = u._id === currentUser?._id;

                  return (
                    <tr key={u._id} className="hover:bg-brand-ivory/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-brand-forest text-brand-ivory flex items-center justify-center font-bold text-xs shadow-xs">
                            {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <span className="font-semibold text-brand-forest block">{u.name}</span>
                            {isSelf && (
                              <span className="text-[10px] text-brand-primary font-bold uppercase tracking-wider">
                                (You)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-brand-muted font-mono text-[11px]">
                        {u.email}
                      </td>
                      <td className="px-6 py-4">
                        {isAdmin && !isSelf ? (
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            className="px-2.5 py-1 rounded-lg border border-brand-border bg-white text-xs font-semibold text-brand-forest focus:outline-none focus:ring-1 focus:ring-brand-primary"
                          >
                            <option value="member">member</option>
                            <option value="manager">manager</option>
                            <option value="admin">admin</option>
                          </select>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-brand-ivory border border-brand-border text-brand-forest">
                            {u.role}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                            u.status === 'active'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          />
                          {u.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-brand-muted">
                        {new Date(u.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 text-right">
                          {!isSelf && (
                            <button
                              onClick={() => handleStatusToggle(u._id, u.status)}
                              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors border ${
                                u.status === 'active'
                                  ? 'border-red-200 text-red-600 hover:bg-red-50'
                                  : 'border-green-200 text-green-700 hover:bg-green-50'
                              }`}
                            >
                              {u.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
