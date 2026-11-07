import api from './api';

export const dashboardService = {
  async getStats() {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  async getMyTasks() {
    const response = await api.get('/dashboard/my-tasks');
    return response.data;
  },

  async getActivity(limit = 20) {
    const response = await api.get('/activity', { params: { limit } });
    return response.data;
  },
};

export const userService = {
  async getUsers(params = {}) {
    const response = await api.get('/users', { params });
    return response.data;
  },

  async getUserById(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.patch('/users/profile', data);
    return response.data;
  },

  async updateUserRole(id, role) {
    const response = await api.patch(`/users/${id}/role`, { role });
    return response.data;
  },

  async updateUserStatus(id, status) {
    const response = await api.patch(`/users/${id}/status`, { status });
    return response.data;
  },
};

export const notificationService = {
  async getNotifications() {
    const response = await api.get('/notifications');
    return response.data;
  },

  async markAsRead(id) {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  async markAllRead() {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },
};
