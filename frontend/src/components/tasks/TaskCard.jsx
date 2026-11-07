import React from 'react';
import { Calendar, MessageSquare, AlertCircle, GripVertical } from 'lucide-react';

export const TaskCard = ({ task, onSelectTask }) => {
  const { _id, title, priority, dueDate, assignedTo, comments = [], project } = task;

  const priorityStyles = {
    Low: 'bg-blue-50 text-blue-700 border-blue-200',
    Medium: 'bg-brand-sage/60 text-brand-forest border-brand-sage',
    High: 'bg-amber-50 text-amber-800 border-amber-200',
    Urgent: 'bg-red-50 text-red-700 border-red-200',
  };

  const isOverdue =
    dueDate && new Date(dueDate) < new Date() && task.status !== 'Completed';

  const formattedDate = dueDate
    ? new Date(dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : null;

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', _id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onSelectTask(task)}
      className="bg-white rounded-xl border border-brand-border p-4 shadow-subtle hover:shadow-card hover:border-brand-sage transition-all cursor-grab active:cursor-grabbing mb-3 group relative"
    >
      {/* Top Header: Priority & Project */}
      <div className="flex items-center justify-between mb-2 gap-2">
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
            priorityStyles[priority] || priorityStyles.Medium
          }`}
        >
          {priority}
        </span>
        {project?.title && (
          <span className="text-[10px] font-medium text-brand-muted truncate max-w-[120px]">
            {project.title}
          </span>
        )}
      </div>

      {/* Task Title */}
      <h4 className="text-sm font-semibold text-brand-forest group-hover:text-brand-primary transition-colors leading-snug">
        {title}
      </h4>

      {/* Footer Info: Due Date, Comments, Assignee */}
      <div className="mt-3.5 pt-3 border-t border-brand-border/60 flex items-center justify-between text-xs text-brand-muted">
        <div className="flex items-center gap-2">
          {formattedDate && (
            <div
              className={`flex items-center gap-1 text-[11px] font-medium ${
                isOverdue ? 'text-red-600 font-semibold' : 'text-brand-muted'
              }`}
            >
              {isOverdue && <AlertCircle className="w-3 h-3 text-red-500" />}
              <Calendar className="w-3 h-3" />
              <span>{formattedDate}</span>
            </div>
          )}

          {comments.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-brand-muted">
              <MessageSquare className="w-3 h-3" />
              <span>{comments.length}</span>
            </div>
          )}
        </div>

        {/* Assignee Avatar */}
        {assignedTo ? (
          <div
            title={`Assigned to ${assignedTo.name}`}
            className="w-6 h-6 rounded-full bg-brand-forest text-brand-ivory flex items-center justify-center text-[10px] font-bold shadow-sm"
          >
            {assignedTo.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        ) : (
          <div className="text-[10px] text-brand-muted italic">Unassigned</div>
        )}
      </div>
    </div>
  );
};
