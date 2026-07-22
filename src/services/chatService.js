import { apiClient } from './apiClient';

class ChatService {
  async getChats(userId) {
    return await apiClient.get(`/chats?userId=${userId}`);
  }

  async getOrCreateChat(buyerId, sellerId, petId) {
    return await apiClient.post('/chats', { buyerId, sellerId, petId });
  }

  async getMessages(chatId) {
    return await apiClient.get(`/chats/${chatId}/messages`);
  }

  async sendMessage(chatId, senderId, text, type = 'text') {
    return await apiClient.post(`/chats/${chatId}/messages`, { senderId, text, type });
  }

  subscribeToMessages(chatId, callback) {
    // Fetch initial messages, replace with polling/WebSockets later
    apiClient.get(`/chats/${chatId}/messages`).then(res => {
      if (res.data) callback(res.data);
    });
    return () => {};
  }

  subscribeToChats(userId, callback) {
    apiClient.get(`/chats?userId=${userId}`).then(res => {
      if (res.data) callback(res.data);
    });
    return () => {};
  }

  async markChatRead(chatId) {
    return await apiClient.put(`/chats/${chatId}/read`);
  }
}

export const chatService = new ChatService();
