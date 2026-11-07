import React from 'react';

export const StatCard = ({ title, value, icon: Icon, change, trend = 'neutral', subtitle }) => {
  return (
    <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle hover:shadow-card transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-brand-muted">{title}</span>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-brand-sage/60 flex items-center justify-center text-brand-primary">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <div className="font-serif text-3xl font-bold text-brand-forest">
          {value}
        </div>
        {change && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              trend === 'up'
                ? 'bg-green-50 text-green-700'
                : trend === 'down'
                ? 'bg-red-50 text-red-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {change}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-brand-muted">{subtitle}</p>
      )}
    </div>
  );
};
