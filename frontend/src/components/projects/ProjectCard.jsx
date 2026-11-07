import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, CheckCircle2, ArrowUpRight } from 'lucide-react';

export const ProjectCard = ({ project }) => {
  const { _id, title, description, status, priority, dueDate, members = [], taskStats } = project;

  const total = taskStats?.total || 0;
  const completed = taskStats?.completed || 0;
  const progress = taskStats?.progress || (total > 0 ? Math.round((completed / total) * 100) : 0);

  const priorityStyles = {
    Low: 'bg-blue-50 text-blue-700 border-blue-200',
    Medium: 'bg-brand-sage/60 text-brand-forest border-brand-sage',
    High: 'bg-amber-50 text-amber-800 border-amber-200',
    Urgent: 'bg-red-50 text-red-700 border-red-200',
  };

  const statusStyles = {
    Planning: 'bg-gray-100 text-gray-700',
    Active: 'bg-green-100 text-green-800',
    'On Hold': 'bg-amber-100 text-amber-800',
    Completed: 'bg-brand-sage text-brand-primary',
    Archived: 'bg-gray-100 text-gray-500',
  };

  const formattedDate = dueDate
    ? new Date(dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : 'No due date';

  return (
    <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between group">
      <div>
        {/* Badges Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
              priorityStyles[priority] || priorityStyles.Medium
            }`}
          >
            {priority} Priority
          </span>
          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
              statusStyles[status] || statusStyles.Active
            }`}
          >
            {status}
          </span>
        </div>

        {/* Title & Description */}
        <Link to={`/projects/${_id}`}>
          <h3 className="font-serif text-xl font-bold text-brand-forest group-hover:text-brand-primary transition-colors flex items-center justify-between">
            <span className="truncate">{title}</span>
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-brand-primary" />
          </h3>
        </Link>
        <p className="mt-2 text-xs text-brand-muted line-clamp-2 leading-relaxed">
          {description || 'No description provided for this project.'}
        </p>

        {/* Progress Bar */}
        <div className="mt-5">
          <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
            <span className="text-brand-muted">Task Progress</span>
            <span className="text-brand-forest font-semibold">{progress}%</span>
          </div>
          <div className="h-2 w-full bg-brand-ivory rounded-full overflow-hidden border border-brand-border/60">
            <div
              className="h-full bg-brand-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-1.5 text-[11px] text-brand-muted flex items-center justify-between">
            <span>{completed} of {total} tasks completed</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-brand-border/80 flex items-center justify-between text-xs text-brand-muted">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>

        {/* Member Avatars */}
        <div className="flex items-center -space-x-1.5 overflow-hidden">
          {members.slice(0, 3).map((m, idx) => (
            <div
              key={m._id || idx}
              title={m.name || 'Team Member'}
              className="w-6 h-6 rounded-full bg-brand-forest text-brand-ivory border-2 border-white flex items-center justify-center text-[10px] font-bold"
            >
              {m.name ? m.name.charAt(0).toUpperCase() : 'M'}
            </div>
          ))}
          {members.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-brand-sage text-brand-primary border-2 border-white flex items-center justify-center text-[9px] font-bold">
              +{members.length - 3}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
