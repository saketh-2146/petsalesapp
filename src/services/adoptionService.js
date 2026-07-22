import { apiClient } from './apiClient';

class AdoptionService {
  async getAdoptionRequests(userId) {
    return await apiClient.get(`/adoptions?requesterId=${userId}`);
  }

  async getRequestsForMyPets(userId) {
    return await apiClient.get(`/adoptions?ownerId=${userId}`);
  }

  async submitRequest(requesterId, petId, ownerId, formDetails) {
    return await apiClient.post('/adoptions', { requesterId, petId, ownerId, formDetails });
  }

  async updateRequestStatus(requestId, status, timelineUpdate) {
    return await apiClient.put(`/adoptions/${requestId}`, { status, timelineUpdate });
  }

  subscribeToAdoptions(userId, callback) {
    apiClient.get(`/adoptions?requesterId=${userId}`).then(res => {
      if (res.data) callback(res.data);
    });
    return () => {};
  }
}

export const adoptionService = new AdoptionService();
