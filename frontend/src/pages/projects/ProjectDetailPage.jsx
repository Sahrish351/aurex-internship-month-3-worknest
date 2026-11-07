import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import { taskService } from '../../services/taskService';
import { userService } from '../../services/dashboardService';
import { KanbanBoard } from '../../components/tasks/KanbanBoard';
import { CreateTaskModal } from '../../components/tasks/CreateTaskModal';
import { TaskDetailModal } from '../../components/tasks/TaskDetailModal';
import { Modal } from '../../components/common/Modal';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Calendar,
  Users,
  CheckCircle2,
  Trash2,
  UserPlus,
  ArrowLeft,
  Plus,
  X,
  FolderKanban,
} from 'lucide-react';

export const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState('To Do');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  // Member management
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUserToAdd, setSelectedUserToAdd] = useState('');

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const res = await projectService.getProjectById(id);
      if (res.data?.project) {
        setProject(res.data.project);
        setTasks(res.data.project.tasks || []);
      }
    } catch (err) {
      toastError(err.response?.data?.error?.message || 'Could not load project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const isOwner = project?.owner?._id === user?._id || project?.owner === user?._id;
  const isAdmin = user?.role === 'admin';
  const canManageProject = isOwner || isAdmin;

  const handleDeleteProject = async () => {
    if (!window.confirm(`Are you sure you want to delete project "${project.title}"? All associated tasks and comments will be permanently removed.`)) {
      return;
    }

    try {
      await projectService.deleteProject(id);
      success('Project deleted successfully');
      navigate('/projects');
    } catch (err) {
      toastError(err.response?.data?.error?.message || 'Failed to delete project');
    }
  };

  const handleOpenAddMember = async () => {
    setIsAddMemberModalOpen(true);
    try {
      const res = await userService.getUsers();
      if (res.data?.users) {
        // Filter out existing members
        const currentMemberIds = project.members.map((m) => m._id.toString());
        const eligible = res.data.users.filter((u) => !currentMemberIds.includes(u._id.toString()));
        setAvailableUsers(eligible);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedUserToAdd) return;

    try {
      const res = await projectService.addMember(id, selectedUserToAdd);
      success('Team member added to project');
      setIsAddMemberModalOpen(false);
      setSelectedUserToAdd('');
      fetchProjectDetails();
    } catch (err) {
      toastError(err.response?.data?.error?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (memberId, memberName) => {
    if (!window.confirm(`Remove ${memberName} from this project?`)) return;

    try {
      await projectService.removeMember(id, memberId);
      success(`${memberName} removed from project`);
      fetchProjectDetails();
    } catch (err) {
      toastError(err.response?.data?.error?.message || 'Failed to remove member');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton count={1} />
        <LoadingSkeleton count={3} />
      </div>
    );
  }

  if (!project) return null;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs font-semibold text-brand-muted">
        <Link to="/projects" className="hover:text-brand-forest flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Projects</span>
        </Link>
        <span>/</span>
        <span className="text-brand-forest truncate">{project.title}</span>
      </div>

      {/* Project Banner & Meta Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-subtle flex flex-col lg:flex-row justify-between gap-6">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-sage text-brand-primary">
              {project.status}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-ivory border border-brand-border text-brand-forest">
              {project.priority} Priority
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-brand-forest">
            {project.title}
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted leading-relaxed font-sans whitespace-pre-wrap">
            {project.description || 'No detailed scope description provided.'}
          </p>

          {/* Metadata Chips */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-brand-muted pt-2">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-brand-primary" />
              <span>
                Target Due Date:{' '}
                <strong className="text-brand-forest">
                  {new Date(project.dueDate).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-brand-forest" />
              <span>
                Project Lead:{' '}
                <strong className="text-brand-forest">
                  {project.owner?.name || 'Assigned Lead'}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right Stats & Actions */}
        <div className="flex flex-col justify-between items-start lg:items-end gap-6 border-t lg:border-t-0 lg:border-l border-brand-border pt-4 lg:pt-0 lg:pl-6 min-w-[240px]">
          {/* Progress Widget */}
          <div className="w-full">
            <div className="flex justify-between items-center text-xs font-semibold mb-1">
              <span className="text-brand-muted">Completion Rate</span>
              <span className="text-brand-forest font-bold">{progress}%</span>
            </div>
            <div className="h-2.5 w-full bg-brand-ivory rounded-full overflow-hidden border border-brand-border">
              <div
                className="h-full bg-brand-primary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-[11px] text-brand-muted mt-1 text-right">
              {completedTasks} of {totalTasks} tasks finalized
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => {
                setDefaultTaskStatus('To Do');
                setIsTaskModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-hoverGreen transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>

            {canManageProject && (
              <button
                onClick={handleDeleteProject}
                className="p-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Project Team Members Panel */}
      <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-forest block mb-1">
            Project Team Members ({project.members?.length || 0})
          </span>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {project.members?.map((m) => (
              <div
                key={m._id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-ivory border border-brand-border/80 text-xs font-medium text-brand-forest"
              >
                <div className="w-5 h-5 rounded-full bg-brand-forest text-brand-ivory flex items-center justify-center font-bold text-[9px]">
                  {m.name ? m.name.charAt(0).toUpperCase() : 'M'}
                </div>
                <span>{m.name}</span>
                {canManageProject && m._id !== project.owner?._id && (
                  <button
                    onClick={() => handleRemoveMember(m._id, m.name)}
                    className="text-brand-muted hover:text-red-600 ml-1"
                    title={`Remove ${m.name}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {canManageProject && (
          <button
            onClick={handleOpenAddMember}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-brand-border bg-white text-brand-forest hover:bg-brand-sage/40 transition-colors flex-shrink-0"
          >
            <UserPlus className="w-4 h-4 text-brand-primary" />
            <span>Add Member</span>
          </button>
        )}
      </div>

      {/* Interactive Project Kanban Board */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-brand-forest">
              Sprint Kanban Board
            </h3>
            <p className="text-xs text-brand-muted">
              Drag and drop tasks between columns to update their stage in real-time
            </p>
          </div>
        </div>

        <KanbanBoard
          tasks={tasks}
          onTasksUpdated={(updatedTasks) => setTasks(updatedTasks)}
          onSelectTask={(task) => setSelectedTask(task)}
          onAddTask={(status) => {
            setDefaultTaskStatus(status);
            setIsTaskModalOpen(true);
          }}
        />
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        defaultProject={project}
        defaultStatus={defaultTaskStatus}
        onTaskCreated={(newTask) => setTasks((prev) => [newTask, ...prev])}
      />

      <TaskDetailModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onTaskUpdated={(updatedTask) =>
          setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)))
        }
        onTaskDeleted={(deletedId) =>
          setTasks((prev) => prev.filter((t) => t._id !== deletedId))
        }
      />

      {/* Add Member Modal */}
      <Modal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        title="Add Team Member to Project"
        subtitle={`Grant access to workspace "${project.title}"`}
      >
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
              Select Registered User
            </label>
            {availableUsers.length === 0 ? (
              <p className="text-xs text-brand-muted italic p-3 bg-brand-ivory rounded-xl">
                All registered platform users are already members of this project.
              </p>
            ) : (
              <select
                value={selectedUserToAdd}
                onChange={(e) => setSelectedUserToAdd(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm text-brand-forest bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
              >
                <option value="">Select an eligible user</option>
                {availableUsers.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email}) — Role: {u.role}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="pt-4 border-t border-brand-border flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddMemberModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-brand-muted hover:text-brand-forest rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedUserToAdd}
              className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-hoverGreen transition-colors shadow-sm disabled:opacity-50"
            >
              Add Member
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
