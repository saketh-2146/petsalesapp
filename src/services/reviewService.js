import { apiClient } from './apiClient';

class ReviewService {
  async getReviewsForUser(revieweeId) {
    return await apiClient.get(`/reviews?revieweeId=${revieweeId}`);
  }

  async submitReview(reviewerId, revieweeId, petId, rating, comment) {
    return await apiClient.post('/reviews', { reviewerId, revieweeId, petId, rating, comment });
  }

  async getAverageRating(revieweeId) {
    const res = await apiClient.get(`/reviews/average?revieweeId=${revieweeId}`);
    return { average: res.data?.average || 0, count: res.data?.count || 0, error: res.error };
  }
}

export const reviewService = new ReviewService();
