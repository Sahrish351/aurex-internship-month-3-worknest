import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { userService } from '../../services/dashboardService';
import { authService } from '../../services/authService';
import { User, Lock, ShieldCheck, Mail, LogOut, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  // Profile Form
  const [profileName, setProfileName] = useState(user?.name || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password Form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileName.trim()) {
      toastError('Name cannot be empty');
      return;
    }

    setUpdatingProfile(true);
    try {
      const res = await userService.updateProfile({ name: profileName });
      updateUser(res.data.user);
      success('Profile details updated successfully');
    } catch (err) {
      toastError(err.response?.data?.error?.message || 'Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toastError('Please fill out all password fields');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toastError('New password must be at least 6 characters long');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toastError('New passwords do not match');
      return;
    }

    setUpdatingPassword(true);
    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      success('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      toastError(err.response?.data?.error?.message || 'Failed to change password');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
          Account Settings
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-forest">
          User Profile & Security
        </h2>
        <p className="text-xs sm:text-sm text-brand-muted mt-1">
          Manage your personal credentials, contact name, and security preferences
        </p>
      </div>

      {/* Account Overview Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-brand-forest text-brand-peach flex items-center justify-center font-bold text-2xl shadow-md flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-brand-forest">{user?.name}</h3>
            <p className="text-xs text-brand-muted flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5" />
              <span>{user?.email}</span>
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-sage text-brand-primary">
                Role: {user?.role}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-green-50 text-green-700">
                Status: {user?.status}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100/60 transition-colors text-xs font-semibold"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Update Profile Name */}
        <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-subtle">
          <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-brand-border">
            <User className="w-5 h-5 text-brand-forest" />
            <h3 className="font-serif text-lg font-bold text-brand-forest">
              Personal Details
            </h3>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm text-brand-muted bg-gray-50 cursor-not-allowed"
              />
              <span className="text-[10px] text-brand-muted mt-1 block">
                Email address cannot be modified directly.
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={updatingProfile}
                className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-hoverGreen transition-colors shadow-sm disabled:opacity-50"
              >
                {updatingProfile ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-subtle">
          <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-brand-border">
            <Lock className="w-5 h-5 text-brand-primary" />
            <h3 className="font-serif text-lg font-bold text-brand-forest">
              Change Password
            </h3>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                required
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                placeholder="Enter current password"
                className="w-full px-3.5 py-2 rounded-xl border border-brand-border text-xs text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2 rounded-xl border border-brand-border text-xs text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={passwordData.confirmNewPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })
                }
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2 rounded-xl border border-brand-border text-xs text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={updatingPassword}
                className="px-5 py-2.5 rounded-xl bg-brand-forest text-brand-ivory text-xs font-semibold hover:bg-brand-darkGreen transition-colors shadow-sm disabled:opacity-50"
              >
                {updatingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
