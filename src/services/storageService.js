import { apiClient } from './apiClient';

class StorageService {
  async uploadPetImage(file, userId) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('userId', userId);

    try {
      const response = await fetch('http://localhost:5000/api/storage/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      const data = await response.json();
      return { publicUrl: data.url, error: null };
    } catch (error) {
      return { publicUrl: null, error: error.message };
    }
  }

  async deletePetImage(fileUrl) {
    return await apiClient.delete('/storage/delete', { body: JSON.stringify({ fileUrl }) });
  }
}

export const storageService = new StorageService();
