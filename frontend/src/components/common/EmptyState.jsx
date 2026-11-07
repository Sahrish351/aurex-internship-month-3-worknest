import React from 'react';
import { FolderPlus } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = FolderPlus,
  title = 'No items found',
  description = 'Get started by creating your first item.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-brand-border p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-8">
      <div className="w-14 h-14 rounded-2xl bg-brand-sage flex items-center justify-center text-brand-primary mb-4 shadow-sm">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-serif text-xl text-brand-forest mb-2">{title}</h3>
      <p className="text-brand-muted text-sm max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-5 py-2.5 rounded-xl bg-brand-primary text-white font-medium text-sm hover:bg-brand-hoverGreen transition-colors shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
