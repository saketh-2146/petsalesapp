import { apiClient } from './apiClient';

class PetService {
  async getPets() {
    return await apiClient.get('/pets');
  }

  async getPetById(id) {
    return await apiClient.get(`/pets/${id}`);
  }

  async addPet(petData) {
    return await apiClient.post('/pets', petData);
  }

  async updatePet(id, petData) {
    return await apiClient.put(`/pets/${id}`, petData);
  }

  async deletePet(id) {
    return await apiClient.delete(`/pets/${id}`);
  }

  subscribeToPets(callback) {
    // Note: Since real-time WebSockets are not configured yet,
    // we do an initial fetch. 
    // In a real REST API, you'd either poll here or use WebSockets.
    apiClient.get('/pets').then(res => {
      if (res.data) {
        callback(res.data);
      }
    });

    // Return a dummy unsubscribe function
    return () => {};
  }
}

export const petService = new PetService();
