import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { TaskComments } from './TaskComments';
import { taskService } from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Calendar, User, Clock, Trash2, CheckCircle2 } from 'lucide-react';

export const TaskDetailModal = ({
  isOpen,
  onClose,
  task: initialTask,
  onTaskUpdated,
  onTaskDeleted,
}) => {
  const [task, setTask] = useState(initialTask);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  useEffect(() => {
    if (initialTask?._id && isOpen) {
      // Fetch fresh populated task with comments
      taskService.getTaskById(initialTask._id).then((res) => {
        if (res.data?.task) {
          setTask(res.data.task);
        }
      }).catch(() => {
        setTask(initialTask);
      });
    }
  }, [initialTask, isOpen]);

  if (!task) return null;

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await taskService.updateTaskStatus(task._id, newStatus);
      const updated = { ...task, status: newStatus };
      setTask(updated);
      if (onTaskUpdated) onTaskUpdated(updated);
      success(`Task moved to ${newStatus}`);
    } catch (err) {
      toastError(err.response?.data?.error?.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${task.title}"?`)) return;

    try {
      await taskService.deleteTask(task._id);
      success('Task deleted successfully');
      if (onTaskDeleted) onTaskDeleted(task._id);
      onClose();
    } catch (err) {
      toastError(err.response?.data?.error?.message || 'Failed to delete task');
    }
  };

  const priorityStyles = {
    Low: 'bg-blue-50 text-blue-700 border-blue-200',
    Medium: 'bg-brand-sage/60 text-brand-forest border-brand-sage',
    High: 'bg-amber-50 text-amber-800 border-amber-200',
    Urgent: 'bg-red-50 text-red-700 border-red-200',
  };

  const canDelete =
    user?.role === 'admin' ||
    task.createdBy?._id === user?._id ||
    task.createdBy === user?._id;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task.title}
      subtitle={task.project?.title ? `Project: ${task.project.title}` : undefined}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Meta Bar: Status & Priority */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-brand-ivory border border-brand-border/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-brand-muted">Status:</span>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-brand-border bg-white text-brand-forest focus:outline-none focus:ring-1 focus:ring-brand-primary"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="In Review">In Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-brand-muted">Priority:</span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                priorityStyles[task.priority] || priorityStyles.Medium
              }`}
            >
              {task.priority}
            </span>
          </div>
        </div>

        {/* Task Description */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
            Description
          </h4>
          <p className="text-sm text-brand-forest bg-white p-4 rounded-xl border border-brand-border/60 leading-relaxed font-sans whitespace-pre-wrap">
            {task.description || 'No detailed description provided.'}
          </p>
        </div>

        {/* Assignment & Due Date Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-brand-ivory/50 border border-brand-border flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-brand-forest text-brand-ivory flex items-center justify-center font-bold">
              <User className="w-4 h-4 text-brand-peach" />
            </div>
            <div>
              <div className="text-[11px] text-brand-muted">Assigned To</div>
              <div className="font-semibold text-brand-forest">
                {task.assignedTo?.name || 'Unassigned'}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-brand-ivory/50 border border-brand-border flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-brand-sage text-brand-primary flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-brand-muted">Target Due Date</div>
              <div className="font-semibold text-brand-forest">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }) : 'Not set'}
              </div>
            </div>
          </div>
        </div>

        {/* Discussion & Comments */}
        <div className="pt-4 border-t border-brand-border">
          <TaskComments
            taskId={task._id}
            initialComments={task.comments || []}
            onCommentsUpdated={(updatedComments) => {
              setTask((prev) => ({ ...prev, comments: updatedComments }));
              if (onTaskUpdated) onTaskUpdated({ ...task, comments: updatedComments });
            }}
          />
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-brand-border flex items-center justify-between">
          {canDelete ? (
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Task</span>
            </button>
          ) : (
            <div></div>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-brand-forest text-brand-ivory text-xs font-semibold hover:bg-brand-darkGreen transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
