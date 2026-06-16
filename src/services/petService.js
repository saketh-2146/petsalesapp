import {
  collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc,
  query, orderBy, where, serverTimestamp, onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';

class PetService {
  /** Fetch all pets ordered by newest first from Firebase */
  async getPets() {
    try {
      const q = query(collection(db, 'pets'), orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching pets from Firebase:', error.message);
      return { data: null, error: error.message };
    }
  }

  /** Fetch pets from our custom Express backend */
  async getPetsFromBackend() {
    try {
      // Connects to the Express server running on port 3001
      const response = await fetch('http://localhost:3001/api/pets');
      if (!response.ok) {
        throw new Error('Failed to fetch from backend server');
      }
      const data = await response.json();
      return { data: data.pets, error: null };
    } catch (error) {
      console.error('Error fetching from custom backend:', error.message);
      return { data: null, error: error.message };
    }
  }

  /** Fetch a single pet by ID */
  async getPetById(id) {
    try {
      const docSnap = await getDoc(doc(db, 'pets', id));
      if (!docSnap.exists()) return { data: null, error: 'Pet not found' };
      return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
    } catch (error) {
      console.error('Error fetching pet details:', error.message);
      return { data: null, error: error.message };
    }
  }

  /** Add a new pet */
  async addPet(petData) {
    try {
      const docRef = await addDoc(collection(db, 'pets'), {
        ...petData,
        created_at: serverTimestamp(),
      });
      return { data: { id: docRef.id, ...petData }, error: null };
    } catch (error) {
      console.error('Error adding pet:', error.message);
      return { data: null, error: error.message };
    }
  }

  /** Update an existing pet */
  async updatePet(id, petData) {
    try {
      await updateDoc(doc(db, 'pets', id), {
        ...petData,
        updated_at: serverTimestamp(),
      });
      return { data: { id, ...petData }, error: null };
    } catch (error) {
      console.error('Error updating pet:', error.message);
      return { data: null, error: error.message };
    }
  }

  /** Delete a pet */
  async deletePet(id) {
    try {
      await deleteDoc(doc(db, 'pets', id));
      return { error: null };
    } catch (error) {
      console.error('Error deleting pet:', error.message);
      return { error: error.message };
    }
  }

  /** Subscribe to real-time pet updates */
  subscribeToPets(callback) {
    const q = query(collection(db, 'pets'), orderBy('created_at', 'desc'));
    return onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(data);
    });
  }
}

export const petService = new PetService();
