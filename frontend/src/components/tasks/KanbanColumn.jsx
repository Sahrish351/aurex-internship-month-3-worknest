import React, { useState } from 'react';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';

export const KanbanColumn = ({
  status,
  title,
  tasks = [],
  colorClass = 'border-brand-border',
  badgeClass = 'bg-gray-100 text-gray-700',
  onDropTask,
  onSelectTask,
  onAddTask,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId && onDropTask) {
      onDropTask(taskId, status);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`bg-brand-ivory/50 rounded-2xl border p-4 flex flex-col min-w-[280px] max-w-sm w-full transition-all duration-200 ${
        isDragOver ? 'border-brand-primary bg-brand-sage/30 ring-2 ring-brand-primary/20' : colorClass
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-brand-border/80">
        <div className="flex items-center space-x-2">
          <span className="font-serif font-bold text-sm text-brand-forest">{title}</span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${badgeClass}`}>
            {tasks.length}
          </span>
        </div>
        {onAddTask && (
          <button
            onClick={() => onAddTask(status)}
            className="p-1 rounded-lg text-brand-muted hover:text-brand-forest hover:bg-white transition-colors"
            title={`Add task to ${title}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Task Cards List */}
      <div className="flex-1 overflow-y-auto min-h-[300px]">
        {tasks.length === 0 ? (
          <div className="h-32 flex items-center justify-center border-2 border-dashed border-brand-border/80 rounded-xl text-center text-xs text-brand-muted">
            Drop tasks here
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task._id} task={task} onSelectTask={onSelectTask} />
          ))
        )}
      </div>
    </div>
  );
};
