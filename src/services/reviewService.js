import {
  collection, doc, addDoc, getDocs, getDoc,
  query, where, orderBy, serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

class ReviewService {
  /** Fetch all reviews for a specific user (reviewee) */
  async getReviewsForUser(revieweeId) {
    try {
      const q = query(
        collection(db, 'reviews'),
        where('reviewee_id', '==', revieweeId),
        orderBy('created_at', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching reviews:', error.message);
      return { data: null, error: error.message };
    }
  }

  /** Submit a review */
  async submitReview(reviewerId, revieweeId, petId, rating, comment) {
    try {
      const docRef = await addDoc(collection(db, 'reviews'), {
        reviewer_id: reviewerId,
        reviewee_id: revieweeId,
        pet_id: petId,
        rating,
        comment,
        created_at: serverTimestamp(),
      });
      return { data: { id: docRef.id }, error: null };
    } catch (error) {
      console.error('Error submitting review:', error.message);
      return { data: null, error: error.message };
    }
  }

  /** Get average rating for a user */
  async getAverageRating(revieweeId) {
    try {
      const q = query(collection(db, 'reviews'), where('reviewee_id', '==', revieweeId));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return { average: 0, count: 0, error: null };

      const ratings = snapshot.docs.map(d => d.data().rating);
      const average = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
      return { average: Math.round(average * 10) / 10, count: ratings.length, error: null };
    } catch (error) {
      console.error('Error getting average rating:', error.message);
      return { average: 0, count: 0, error: error.message };
    }
  }
}

export const reviewService = new ReviewService();
