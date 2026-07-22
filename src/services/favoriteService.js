import { apiClient } from './apiClient';

class FavoriteService {
  async getFavorites(userId) {
    return await apiClient.get(`/favorites?userId=${userId}`);
  }

  async addFavorite(userId, petId) {
    return await apiClient.post('/favorites', { userId, petId });
  }

  async removeFavorite(userId, petId) {
    return await apiClient.delete(`/favorites?userId=${userId}&petId=${petId}`);
  }

  async toggleFavorite(userId, petId, currentFavorites) {
    if (currentFavorites.includes(petId)) {
      return this.removeFavorite(userId, petId);
    } else {
      return this.addFavorite(userId, petId);
    }
  }
}

export const favoriteService = new FavoriteService();
