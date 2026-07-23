import { apiClient } from './apiClient';

class StorageService {
  async uploadPetImage(file, userId) {
    const formData = new FormData();
    formData.append('image', file);

    const { data, error } = await apiClient.upload('/storage/upload', formData);

    if (error) {
      return { publicUrl: null, error };
    }

    return { publicUrl: data?.url || null, error: null };
  }

  async deletePetImage(fileUrl) {
    return await apiClient.delete('/storage/delete');
  }
}

export const storageService = new StorageService();
