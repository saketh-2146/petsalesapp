import {
  collection, doc, addDoc, getDoc, getDocs, updateDoc,
  query, orderBy, where, serverTimestamp, onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';

class AdoptionService {
  /** Fetch adoption requests submitted by a user */
  async getAdoptionRequests(userId) {
    try {
      const q = query(
        collection(db, 'adoptions'),
        where('requester_id', '==', userId),
        orderBy('created_at', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching adoption requests:', error.message);
      return { data: null, error: error.message };
    }
  }

  /** Fetch adoption requests for pets owned by the user (seller view) */
  async getRequestsForMyPets(userId) {
    try {
      const q = query(
        collection(db, 'adoptions'),
        where('owner_id', '==', userId),
        orderBy('created_at', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching requests for my pets:', error.message);
      return { data: null, error: error.message };
    }
  }

  /** Submit a new adoption request */
  async submitRequest(requesterId, petId, ownerId, formDetails) {
    try {
      const timeline = [
        { title: 'Application Submitted', description: 'Your application has been received and is waiting for owner review.', date: new Date().toLocaleDateString(), completed: true },
        { title: 'Owner Review', description: 'The pet owner is evaluating your housing and profile details.', date: '', completed: false },
        { title: 'Virtual Interview', description: 'Schedule a call to discuss house rules and pet adjustments.', date: '', completed: false },
        { title: 'Application Approved', description: 'Final agreements and vaccine certificate verification.', date: '', completed: false }
      ];

      const docRef = await addDoc(collection(db, 'adoptions'), {
        requester_id: requesterId,
        owner_id: ownerId,
        pet_id: petId,
        status: 'pending',
        message: formDetails.message || '',
        housing_type: formDetails.housingType || formDetails.housing || '',
        has_children: formDetails.hasChildren || false,
        has_other_pets: formDetails.hasOtherPets || false,
        timeline,
        created_at: serverTimestamp(),
      });

      return { data: { id: docRef.id }, error: null };
    } catch (error) {
      console.error('Error submitting adoption request:', error.message);
      return { data: null, error: error.message };
    }
  }

  /** Update adoption request status */
  async updateRequestStatus(requestId, status, timelineUpdate) {
    try {
      const updateData = { status, updated_at: serverTimestamp() };
      if (timelineUpdate) updateData.timeline = timelineUpdate;

      await updateDoc(doc(db, 'adoptions', requestId), updateData);
      return { data: { id: requestId, status }, error: null };
    } catch (error) {
      console.error('Error updating adoption request:', error.message);
      return { data: null, error: error.message };
    }
  }

  /** Subscribe to real-time adoption updates for a user */
  subscribeToAdoptions(userId, callback) {
    const q = query(
      collection(db, 'adoptions'),
      where('requester_id', '==', userId),
      orderBy('created_at', 'desc')
    );
    return onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(data);
    });
  }
}

export const adoptionService = new AdoptionService();
