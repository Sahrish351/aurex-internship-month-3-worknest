import React from 'react';
import { KanbanColumn } from './KanbanColumn';
import { taskService } from '../../services/taskService';
import { useToast } from '../../context/ToastContext';

export const KanbanBoard = ({ tasks = [], onTasksUpdated, onSelectTask, onAddTask }) => {
  const { success, error: toastError } = useToast();

  const columns = [
    {
      status: 'To Do',
      title: 'To Do',
      colorClass: 'border-brand-border',
      badgeClass: 'bg-gray-100 text-gray-700',
    },
    {
      status: 'In Progress',
      title: 'In Progress',
      colorClass: 'border-blue-200',
      badgeClass: 'bg-blue-100 text-blue-800',
    },
    {
      status: 'In Review',
      title: 'In Review',
      colorClass: 'border-amber-200',
      badgeClass: 'bg-amber-100 text-amber-800',
    },
    {
      status: 'Completed',
      title: 'Completed',
      colorClass: 'border-green-200',
      badgeClass: 'bg-green-100 text-green-800',
    },
  ];

  const handleDropTask = async (taskId, newStatus) => {
    const taskToMove = tasks.find((t) => t._id === taskId);
    if (!taskToMove || taskToMove.status === newStatus) return;

    const previousStatus = taskToMove.status;

    // Optimistic UI update
    const updatedTasks = tasks.map((t) =>
      t._id === taskId ? { ...t, status: newStatus } : t
    );
    onTasksUpdated(updatedTasks);

    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      success(`Task "${taskToMove.title}" moved to ${newStatus}`);
    } catch (err) {
      // Revert optimistic update on failure
      const reverted = tasks.map((t) =>
        t._id === taskId ? { ...t, status: previousStatus } : t
      );
      onTasksUpdated(reverted);
      toastError(err.response?.data?.error?.message || 'Failed to update task status');
    }
  };

  return (
    <div className="flex gap-5 overflow-x-auto pb-6 pt-2 items-start">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.status);
        return (
          <KanbanColumn
            key={col.status}
            status={col.status}
            title={col.title}
            colorClass={col.colorClass}
            badgeClass={col.badgeClass}
            tasks={colTasks}
            onDropTask={handleDropTask}
            onSelectTask={onSelectTask}
            onAddTask={onAddTask}
          />
        );
      })}
    </div>
  );
};
