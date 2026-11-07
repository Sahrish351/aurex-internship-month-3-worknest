import React from 'react';

export const LoadingSkeleton = ({ count = 3, type = 'card' }) => {
  if (type === 'table') {
    return (
      <div className="w-full bg-white rounded-2xl border border-brand-border p-6 animate-pulse">
        <div className="h-6 bg-brand-sage/60 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[...Array(count)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle animate-pulse space-y-4"
        >
          <div className="flex justify-between items-center">
            <div className="h-5 bg-brand-sage/60 rounded w-1/3"></div>
            <div className="h-6 w-16 bg-gray-100 rounded-full"></div>
          </div>
          <div className="h-4 bg-gray-100 rounded w-3/4"></div>
          <div className="h-4 bg-gray-100 rounded w-1/2"></div>
          <div className="pt-4 border-t border-brand-border flex justify-between items-center">
            <div className="h-8 w-8 bg-brand-sage/40 rounded-full"></div>
            <div className="h-4 bg-gray-100 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
