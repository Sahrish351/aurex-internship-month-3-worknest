import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  User,
  ShieldCheck,
  X,
  Compass,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Tasks & Kanban', path: '/tasks', icon: CheckSquare },
    ...(isAdmin
      ? [{ name: 'User Management', path: '/admin/users', icon: ShieldCheck, badge: 'Admin' }]
      : isManager
      ? [{ name: 'Team Directory', path: '/admin/users', icon: Users }]
      : []),
    { name: 'Profile & Settings', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-brand-forest/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-brand-border flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-18 flex items-center justify-between px-6 border-b border-brand-border">
            <NavLink to="/dashboard" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-forest flex items-center justify-center text-brand-ivory shadow-sm">
                <Compass className="w-5 h-5 text-brand-peach" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-tight text-brand-forest block leading-none">
                  WorkNest
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-brand-primary">
                  Enterprise
                </span>
              </div>
            </NavLink>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-brand-muted hover:text-brand-forest hover:bg-brand-sage/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Quick Info */}
          <div className="mx-4 my-4 p-3.5 rounded-xl bg-brand-ivory/80 border border-brand-border/60 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-brand-forest text-brand-ivory flex items-center justify-center font-semibold text-sm shadow-sm flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-brand-forest truncate">
                {user?.name || 'Authenticated User'}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <span className="text-[11px] font-medium capitalize text-brand-muted">
                  {user?.role || 'member'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-brand-sage text-brand-primary font-semibold shadow-subtle'
                        : 'text-brand-muted hover:bg-brand-ivory hover:text-brand-forest'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-brand-forest text-brand-ivory px-2 py-0.5 rounded-md">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Workspace Footer Note */}
        <div className="p-4 border-t border-brand-border text-xs text-brand-muted">
          <div className="text-[11px] font-medium text-brand-forest">AUREX Internship Project</div>
          <div className="text-[10px] text-brand-muted mt-0.5">Production Full-Stack v1.0.0</div>
        </div>
      </aside>
    </>
  );
};
