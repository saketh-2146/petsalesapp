import {
  collection, doc, addDoc, deleteDoc, getDocs,
  query, where, serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

class FavoriteService {
  /** Fetch all favorite pet IDs for a user */
  async getFavorites(userId) {
    try {
      const q = query(collection(db, 'favorites'), where('user_id', '==', userId));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(d => d.data().pet_id);
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching favorites:', error.message);
      return { data: [], error: error.message };
    }
  }

  /** Add a pet to favorites */
  async addFavorite(userId, petId) {
    try {
      const docRef = await addDoc(collection(db, 'favorites'), {
        user_id: userId,
        pet_id: petId,
        created_at: serverTimestamp(),
      });
      return { data: { id: docRef.id }, error: null };
    } catch (error) {
      console.error('Error adding favorite:', error.message);
      return { data: null, error: error.message };
    }
  }

  /** Remove a pet from favorites */
  async removeFavorite(userId, petId) {
    try {
      const q = query(
        collection(db, 'favorites'),
        where('user_id', '==', userId),
        where('pet_id', '==', petId)
      );
      const snapshot = await getDocs(q);
      await Promise.all(snapshot.docs.map(d => deleteDoc(d.ref)));
      return { error: null };
    } catch (error) {
      console.error('Error removing favorite:', error.message);
      return { error: error.message };
    }
  }

  /** Toggle a favorite */
  async toggleFavorite(userId, petId, currentFavorites) {
    if (currentFavorites.includes(petId)) {
      return this.removeFavorite(userId, petId);
    } else {
      return this.addFavorite(userId, petId);
    }
  }
}

export const favoriteService = new FavoriteService();
