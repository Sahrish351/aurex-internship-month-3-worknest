import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-brand-ivory flex flex-col justify-center items-center px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-brand-forest flex items-center justify-center text-brand-peach mb-6 shadow-md">
        <Compass className="w-7 h-7" />
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-2">
        404 — Page Not Found
      </span>
      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-forest max-w-md">
        Lost in the workspace?
      </h1>
      <p className="mt-4 text-sm text-brand-muted max-w-sm leading-relaxed">
        The page you are attempting to reach does not exist, has been moved, or has expired.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-hoverGreen transition-colors shadow-sm"
        >
          <Home className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-brand-border text-brand-forest text-sm font-semibold hover:bg-brand-ivory transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </Link>
      </div>
    </div>
  );
};
