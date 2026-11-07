import React from 'react';
import { Menu, LogOut, ExternalLink, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = ({ onOpenSidebar, pageTitle = 'Dashboard' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-18 bg-white/80 backdrop-blur-md border-b border-brand-border px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl border border-brand-border text-brand-muted hover:text-brand-forest hover:bg-brand-sage/40"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="font-serif text-lg sm:text-xl font-bold text-brand-forest tracking-tight">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-3">
        {/* Landing Page link shortcut */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-muted hover:text-brand-forest rounded-xl border border-brand-border hover:bg-brand-ivory transition-colors"
          title="Open Public Marketing Site"
        >
          <Globe className="w-3.5 h-3.5 text-brand-primary" />
          <span>Marketing Site</span>
        </Link>

        {/* Notifications */}
        <NotificationDropdown />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-red-200 text-red-700 bg-red-50/50 hover:bg-red-100/60 transition-colors"
          title="Sign out of WorkNest"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
