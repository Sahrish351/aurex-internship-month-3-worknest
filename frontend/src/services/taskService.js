import api from './api';

export const taskService = {
  async getTasks(params = {}) {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  async getTaskById(id) {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  async createTask(data) {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  async updateTask(id, data) {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  async updateTaskStatus(id, status) {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },

  async deleteTask(id) {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  async addComment(taskId, text) {
    const response = await api.post(`/tasks/${taskId}/comments`, { text });
    return response.data;
  },

  async getComments(taskId) {
    const response = await api.get(`/tasks/${taskId}/comments`);
    return response.data;
  },

  async deleteComment(commentId) {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },
};
