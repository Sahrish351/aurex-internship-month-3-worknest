import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

export const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-brand-ivory flex flex-col justify-center items-center px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 mb-6 shadow-md border border-red-200">
        <ShieldAlert className="w-7 h-7" />
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">
        403 — Access Denied
      </span>
      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-forest max-w-md">
        Permission required
      </h1>
      <p className="mt-4 text-sm text-brand-muted max-w-sm leading-relaxed">
        Your current role does not have administrative privileges to access this area of the WorkNest platform.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-forest text-brand-ivory text-sm font-semibold hover:bg-brand-darkGreen transition-colors shadow-sm"
        >
          <Home className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};
