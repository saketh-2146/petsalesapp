import { apiClient } from './apiClient';

class NotificationService {
  async getNotifications(userId) {
    return await apiClient.get(`/notifications?userId=${userId}`);
  }

  async markAsRead(notificationId) {
    return await apiClient.put(`/notifications/${notificationId}/read`);
  }

  async markAllAsRead(userId) {
    return await apiClient.put(`/notifications/read-all`, { userId });
  }

  async createNotification(userId, title, body, type = 'info') {
    return await apiClient.post('/notifications', { userId, title, body, type });
  }

  subscribeToNotifications(userId, callback) {
    apiClient.get(`/notifications?userId=${userId}`).then(res => {
      if (res.data) callback(res.data);
    });
    return () => {};
  }
}

export const notificationService = new NotificationService();
