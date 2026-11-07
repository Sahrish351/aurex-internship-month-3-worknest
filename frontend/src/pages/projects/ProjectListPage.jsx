import React, { useState, useEffect } from 'react';
import { projectService } from '../../services/projectService';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { CreateProjectModal } from '../../components/projects/CreateProjectModal';
import { useAuth } from '../../context/AuthContext';
import { Search, Filter, Plus, FolderKanban } from 'lucide-react';

export const ProjectListPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { user } = useAuth();
  const canCreate = user?.role === 'admin' || user?.role === 'manager';

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;

      const res = await projectService.getProjects(params);
      if (res.data?.projects) {
        setProjects(res.data.projects);
      }
    } catch (err) {
      console.error('[Projects] Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProjects();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [search, statusFilter, priorityFilter]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
            Workspaces
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-forest">
            Project Directory
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Browse and monitor active initiatives across your organization
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs sm:text-sm font-semibold hover:bg-brand-hoverGreen transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-brand-border shadow-subtle">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title or description..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-brand-border text-xs sm:text-sm text-brand-forest bg-brand-ivory/30 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-44 px-3 py-2 rounded-xl border border-brand-border text-xs sm:text-sm text-brand-forest bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          >
            <option value="">All Statuses</option>
            <option value="Planning">Planning</option>
            <option value="Active">Active</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full md:w-44 px-3 py-2 rounded-xl border border-brand-border text-xs sm:text-sm text-brand-forest bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Project Cards Grid */}
      {loading ? (
        <LoadingSkeleton count={6} />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects match your filter"
          description="Adjust your search criteria or create a new project to get started."
          actionLabel={canCreate ? 'Create New Project' : undefined}
          onAction={canCreate ? () => setIsCreateModalOpen(true) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProjectCreated={() => fetchProjects()}
      />
    </div>
  );
};
