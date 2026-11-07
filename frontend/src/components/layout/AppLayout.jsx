import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Dynamic Page Title
  const getPageTitle = (pathname) => {
    if (pathname.startsWith('/dashboard')) return 'Overview & Analytics';
    if (pathname.startsWith('/projects/') && pathname !== '/projects') return 'Project Workspace';
    if (pathname.startsWith('/projects')) return 'Project Directory';
    if (pathname.startsWith('/tasks')) return 'Interactive Kanban & Tasks';
    if (pathname.startsWith('/admin/users')) return 'User & Permission Management';
    if (pathname.startsWith('/profile')) return 'Account & Security Settings';
    return 'WorkNest Workspace';
  };

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-forest">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          pageTitle={getPageTitle(location.pathname)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
