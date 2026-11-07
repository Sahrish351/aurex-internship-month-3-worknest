import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { projectService } from '../../services/projectService';
import { userService } from '../../services/dashboardService';
import { useToast } from '../../context/ToastContext';

export const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Planning',
    dueDate: '',
    members: [],
  });
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    if (isOpen) {
      // Fetch users for member selection
      userService.getUsers().then((res) => {
        if (res.data?.users) {
          setUsersList(res.data.users);
        }
      }).catch(() => {});
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toastError('Project title is required');
      return;
    }
    if (!formData.dueDate) {
      toastError('Target due date is required');
      return;
    }

    setLoading(true);
    try {
      const res = await projectService.createProject(formData);
      success(`Project "${formData.title}" created successfully!`);
      onProjectCreated(res.data.project);
      onClose();
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Planning',
        dueDate: '',
        members: [],
      });
    } catch (err) {
      toastError(err.response?.data?.error?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const toggleMember = (userId) => {
    setFormData((prev) => {
      const exists = prev.members.includes(userId);
      return {
        ...prev,
        members: exists ? prev.members.filter((id) => id !== userId) : [...prev.members, userId],
      };
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      subtitle="Define workspace goals, deadlines, and assign team members"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1">
            Project Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Q4 Website Redesign & Migration"
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1">
            Description
          </label>
          <textarea
            rows="3"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Scope, objectives, and milestones..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
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
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm text-brand-forest bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            >
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
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

        {/* Member Select */}
        {usersList.length > 0 && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
              Assign Team Members
            </label>
            <div className="max-h-36 overflow-y-auto border border-brand-border rounded-xl p-2 divide-y divide-brand-border/40 bg-brand-ivory/30">
              {usersList.map((u) => (
                <label
                  key={u._id}
                  className="flex items-center justify-between p-2 hover:bg-white rounded-lg cursor-pointer text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.members.includes(u._id)}
                      onChange={() => toggleMember(u._id)}
                      className="rounded border-brand-border text-brand-primary focus:ring-brand-primary"
                    />
                    <span className="font-medium text-brand-forest">{u.name}</span>
                    <span className="text-[11px] text-brand-muted">({u.role})</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

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
            {loading ? 'Creating Project...' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
