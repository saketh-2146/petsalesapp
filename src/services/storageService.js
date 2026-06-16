import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

class StorageService {
  /**
   * Upload a pet image to Firebase Storage
   * @param {File} file The file to upload
   * @param {String} userId The user's ID for organizing folders
   */
  async uploadPetImage(file, userId) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `pet-images/${userId}/${Date.now()}.${fileExt}`;
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, file);
      const publicUrl = await getDownloadURL(storageRef);

      return { publicUrl, error: null };
    } catch (error) {
      console.error('Error uploading image:', error.message);
      return { publicUrl: null, error: error.message };
    }
  }

  /**
   * Delete a pet image from Firebase Storage
   * @param {String} fileUrl The download URL of the file to delete
   */
  async deletePetImage(fileUrl) {
    try {
      const storageRef = ref(storage, fileUrl);
      await deleteObject(storageRef);
      return { error: null };
    } catch (error) {
      console.error('Error deleting image:', error.message);
      return { error: error.message };
    }
  }
}

export const storageService = new StorageService();
