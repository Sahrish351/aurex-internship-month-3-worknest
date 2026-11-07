import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../services/dashboardService';
import { StatCard } from '../../components/common/StatCard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { CreateProjectModal } from '../../components/projects/CreateProjectModal';
import { CreateTaskModal } from '../../components/tasks/CreateTaskModal';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Users,
  AlertCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [myTasks, setMyTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, tasksRes, actRes] = await Promise.all([
        dashboardService.getStats().catch(() => ({ data: null })),
        dashboardService.getMyTasks().catch(() => ({ data: { tasks: [] } })),
        dashboardService.getActivity(8).catch(() => ({ data: { activities: [] } })),
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (tasksRes?.data?.tasks) setMyTasks(tasksRes.data.tasks);
      if (actRes?.data?.activities) setActivities(actRes.data.activities);
    } catch (err) {
      console.error('[Dashboard] Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="h-8 bg-brand-sage/40 rounded w-1/3"></div>
        <LoadingSkeleton count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LoadingSkeleton count={1} type="table" />
          <LoadingSkeleton count={1} type="table" />
        </div>
      </div>
    );
  }

  const overview = stats?.overview || {};

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-subtle">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
            Workspace Overview • {user?.role?.toUpperCase()}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-forest mt-1">
            Welcome back, {user?.name || 'Engineer'}
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-xl">
            {isAdmin
              ? 'Platform-wide governance metrics, user accounts, and infrastructure activity.'
              : isManager
              ? 'Project milestones, team delegation, sprint velocity, and upcoming deadlines.'
              : 'Your assigned project tasks, upcoming deadlines, and team discussions.'}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {(isAdmin || isManager) && (
            <button
              onClick={() => setIsProjectModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-forest text-brand-ivory text-xs font-semibold hover:bg-brand-darkGreen transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 text-brand-peach" />
              <span>New Project</span>
            </button>
          )}
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-hoverGreen transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Dynamic Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {isAdmin ? (
          <>
            <StatCard
              title="Registered Users"
              value={overview.totalUsers ?? 0}
              icon={Users}
              subtitle={`${overview.activeUsers ?? 0} active accounts`}
            />
            <StatCard
              title="Total Projects"
              value={overview.totalProjects ?? 0}
              icon={FolderKanban}
              subtitle={`${overview.activeProjects ?? 0} active in progress`}
            />
            <StatCard
              title="Platform Tasks"
              value={overview.totalTasks ?? 0}
              icon={Layers}
              subtitle={`${overview.completedTasks ?? 0} completed`}
            />
            <StatCard
              title="System Completion"
              value={`${overview.completionRate ?? 0}%`}
              icon={TrendingUp}
              trend="up"
              subtitle="All platform tasks"
            />
          </>
        ) : isManager ? (
          <>
            <StatCard
              title="Managed Projects"
              value={overview.totalProjects ?? 0}
              icon={FolderKanban}
              subtitle={`${overview.activeProjects ?? 0} active in progress`}
            />
            <StatCard
              title="Total Team Tasks"
              value={overview.totalTasks ?? 0}
              icon={Layers}
              subtitle={`${overview.completedTasks ?? 0} finalized`}
            />
            <StatCard
              title="Overdue Tasks"
              value={overview.overdueTasks ?? 0}
              icon={AlertCircle}
              trend={overview.overdueTasks > 0 ? 'down' : 'neutral'}
              subtitle="Requires attention"
            />
            <StatCard
              title="Team Members"
              value={overview.teamMembersCount ?? 0}
              icon={Users}
              subtitle="Assigned across projects"
            />
          </>
        ) : (
          <>
            <StatCard
              title="Assigned Tasks"
              value={overview.assignedTasks ?? 0}
              icon={Layers}
              subtitle="Assigned to your queue"
            />
            <StatCard
              title="Completed Work"
              value={overview.completedTasks ?? 0}
              icon={CheckCircle2}
              trend="up"
              subtitle={`${overview.completionRate ?? 0}% completion rate`}
            />
            <StatCard
              title="In Progress"
              value={overview.inProgressTasks ?? 0}
              icon={Clock}
              subtitle="Active sprint items"
            />
            <StatCard
              title="Overdue Tasks"
              value={overview.overdueTasks ?? 0}
              icon={AlertCircle}
              trend={overview.overdueTasks > 0 ? 'down' : 'neutral'}
              subtitle={overview.overdueTasks > 0 ? 'Past deadline' : 'All on time'}
            />
          </>
        )}
      </div>

      {/* Grid: My Tasks & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Upcoming Tasks */}
        <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-brand-border">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-brand-primary" />
                <h3 className="font-serif text-lg font-bold text-brand-forest">
                  {isAdmin || isManager ? 'Priority Tasks Queue' : 'My Assigned Tasks'}
                </h3>
              </div>
              <Link
                to="/tasks"
                className="text-xs font-semibold text-brand-primary hover:text-brand-hoverGreen flex items-center gap-1"
              >
                <span>View Kanban</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-brand-border/60">
              {myTasks.length === 0 ? (
                <div className="p-8 text-center text-xs text-brand-muted">
                  No pending tasks in queue. All clear!
                </div>
              ) : (
                myTasks.slice(0, 5).map((task) => (
                  <div key={task._id} className="py-3 flex items-center justify-between gap-3 group">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            task.status === 'Completed'
                              ? 'bg-green-500'
                              : task.status === 'In Progress'
                              ? 'bg-blue-500'
                              : 'bg-gray-400'
                          }`}
                        />
                        <span className="text-xs font-semibold text-brand-forest truncate group-hover:text-brand-primary transition-colors">
                          {task.title}
                        </span>
                      </div>
                      <span className="text-[11px] text-brand-muted truncate block">
                        {task.project?.title || 'WorkNest Task'} • Due {new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-brand-ivory border border-brand-border text-brand-forest">
                      {task.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-brand-border/80 text-center">
            <Link
              to="/tasks"
              className="text-xs font-medium text-brand-muted hover:text-brand-forest transition-colors"
            >
              Open Interactive Kanban Board →
            </Link>
          </div>
        </div>

        {/* Live Activity Audit Feed */}
        <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-brand-border">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-brand-forest" />
                <h3 className="font-serif text-lg font-bold text-brand-forest">
                  Recent Audit Trail
                </h3>
              </div>
              <span className="text-[11px] font-mono text-brand-muted">ActivityLog</span>
            </div>

            <div className="divide-y divide-brand-border/60">
              {activities.length === 0 ? (
                <div className="p-8 text-center text-xs text-brand-muted">
                  No activity records logged yet.
                </div>
              ) : (
                activities.slice(0, 6).map((act) => (
                  <div key={act._id} className="py-2.5 flex items-start gap-3 text-xs">
                    <div className="w-6 h-6 rounded-full bg-brand-forest text-brand-ivory flex items-center justify-center font-bold text-[10px] mt-0.5 flex-shrink-0">
                      {act.actor?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-brand-forest leading-snug font-medium">
                        {act.details}
                      </p>
                      <span className="text-[10px] text-brand-muted">
                        {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(act.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-brand-border/80 text-center">
            <span className="text-[11px] text-brand-muted">
              Auto-logged via MongoDB ActivityLog Collection
            </span>
          </div>
        </div>
      </div>

      {/* Create Modals */}
      <CreateProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onProjectCreated={() => fetchDashboardData()}
      />
      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onTaskCreated={() => fetchDashboardData()}
      />
    </div>
  );
};
