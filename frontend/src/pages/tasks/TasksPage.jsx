import React, { useState, useEffect } from 'react';
import { taskService } from '../../services/taskService';
import { projectService } from '../../services/projectService';
import { KanbanBoard } from '../../components/tasks/KanbanBoard';
import { CreateTaskModal } from '../../components/tasks/CreateTaskModal';
import { TaskDetailModal } from '../../components/tasks/TaskDetailModal';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Search, Plus, Kanban, List, CheckSquare } from 'lucide-react';

export const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'

  // Filters
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState('To Do');
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (projectFilter) params.project = projectFilter;
      if (priorityFilter) params.priority = priorityFilter;

      const [taskRes, projRes] = await Promise.all([
        taskService.getTasks(params),
        projectService.getProjects().catch(() => ({ data: { projects: [] } })),
      ]);

      if (taskRes?.data?.tasks) setTasks(taskRes.data.tasks);
      if (projRes?.data?.projects) setProjects(projRes.data.projects);
    } catch (err) {
      console.error('[Tasks] Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchTasks();
    }, 250);
    return () => clearTimeout(delay);
  }, [search, projectFilter, priorityFilter]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
            Execution
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-forest">
            Tasks & Kanban Board
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Track sprints, reassign duties, and move items across workflow stages
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white border border-brand-border rounded-xl p-1 shadow-subtle">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-brand-sage text-brand-primary shadow-xs'
                  : 'text-brand-muted hover:text-brand-forest'
              }`}
              title="Kanban Board View"
            >
              <Kanban className="w-4 h-4" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-brand-sage text-brand-primary shadow-xs'
                  : 'text-brand-muted hover:text-brand-forest'
              }`}
              title="Table List View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          <button
            onClick={() => {
              setDefaultStatus('To Do');
              setIsTaskModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs sm:text-sm font-semibold hover:bg-brand-hoverGreen transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-brand-border shadow-subtle">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks by title or details..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-brand-border text-xs sm:text-sm text-brand-forest bg-brand-ivory/30 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Project Filter */}
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="w-full md:w-48 px-3 py-2 rounded-xl border border-brand-border text-xs sm:text-sm text-brand-forest bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full md:w-36 px-3 py-2 rounded-xl border border-brand-border text-xs sm:text-sm text-brand-forest bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Content Rendering: Kanban or List */}
      {loading ? (
        <LoadingSkeleton count={4} />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks found"
          description="Adjust your search filters or create a task to begin tracking work."
          actionLabel="Create Task"
          onAction={() => setIsTaskModalOpen(true)}
        />
      ) : viewMode === 'kanban' ? (
        <KanbanBoard
          tasks={tasks}
          onTasksUpdated={(updated) => setTasks(updated)}
          onSelectTask={(task) => setSelectedTask(task)}
          onAddTask={(status) => {
            setDefaultStatus(status);
            setIsTaskModalOpen(true);
          }}
        />
      ) : (
        /* Table View */
        <div className="bg-white rounded-3xl border border-brand-border shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-brand-forest">
              <thead className="bg-brand-ivory border-b border-brand-border text-brand-muted uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">Task</th>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Assignee</th>
                  <th className="px-6 py-4">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {tasks.map((task) => (
                  <tr
                    key={task._id}
                    onClick={() => setSelectedTask(task)}
                    className="hover:bg-brand-ivory/50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-brand-forest">
                      {task.title}
                    </td>
                    <td className="px-6 py-4 text-brand-muted">
                      {task.project?.title || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-ivory border border-brand-border">
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100">
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {task.assignedTo?.name || <span className="text-brand-muted italic">Unassigned</span>}
                    </td>
                    <td className="px-6 py-4 text-brand-muted">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        defaultStatus={defaultStatus}
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
    </div>
  );
};
