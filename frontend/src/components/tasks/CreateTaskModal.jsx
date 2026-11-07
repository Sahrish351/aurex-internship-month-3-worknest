import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { taskService } from '../../services/taskService';
import { projectService } from '../../services/projectService';
import { useToast } from '../../context/ToastContext';

export const CreateTaskModal = ({
  isOpen,
  onClose,
  defaultProject = null,
  defaultStatus = 'To Do',
  onTaskCreated,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: defaultProject?._id || '',
    assignedTo: '',
    priority: 'Medium',
    status: defaultStatus,
    dueDate: '',
  });

  const [projectsList, setProjectsList] = useState([]);
  const [activeProjectMembers, setActiveProjectMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        project: defaultProject?._id || prev.project,
        status: defaultStatus,
      }));

      // Load projects if not locked to one
      projectService.getProjects().then((res) => {
        if (res.data?.projects) {
          setProjectsList(res.data.projects);
          const currentProj = res.data.projects.find(
            (p) => p._id === (defaultProject?._id || formData.project)
          );
          if (currentProj) {
            setActiveProjectMembers(currentProj.members || []);
          }
        }
      }).catch(() => {});
    }
  }, [isOpen, defaultProject, defaultStatus]);

  const handleProjectChange = (projectId) => {
    setFormData((prev) => ({ ...prev, project: projectId, assignedTo: '' }));
    const proj = projectsList.find((p) => p._id === projectId);
    if (proj) {
      setActiveProjectMembers(proj.members || []);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toastError('Task title is required');
      return;
    }
    if (!formData.project) {
      toastError('Please select a project');
      return;
    }
    if (!formData.dueDate) {
      toastError('Due date is required');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        assignedTo: formData.assignedTo || undefined,
      };
      const res = await taskService.createTask(payload);
      success(`Task "${formData.title}" created successfully!`);
      onTaskCreated(res.data.task);
      onClose();
      setFormData({
        title: '',
        description: '',
        project: defaultProject?._id || '',
        assignedTo: '',
        priority: 'Medium',
        status: 'To Do',
        dueDate: '',
      });
    } catch (err) {
      toastError(err.response?.data?.error?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      subtitle="Define actionable work items and assign responsibilities"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1">
            Task Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Implement Role-Based Middleware"
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
        </div>

        {/* Project Selector (if not preselected) */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1">
            Project Workspace *
          </label>
          <select
            value={formData.project}
            onChange={(e) => handleProjectChange(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm text-brand-forest bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          >
            <option value="">Select a project</option>
            {projectsList.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Assignee Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1">
            Assign To (Project Members)
          </label>
          <select
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm text-brand-forest bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          >
            <option value="">Unassigned</option>
            {activeProjectMembers.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name} ({m.email})
              </option>
            ))}
          </select>
        </div>

        {/* Priority & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm text-brand-forest bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1">
              Kanban Column / Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm text-brand-forest bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="In Review">In Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1">
            Target Due Date *
          </label>
          <input
            type="date"
            required
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm text-brand-forest bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1">
            Task Description
          </label>
          <textarea
            rows="3"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Details, acceptance criteria, or reference notes..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-brand-border flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-brand-muted hover:text-brand-forest rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-hoverGreen transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? 'Creating Task...' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
