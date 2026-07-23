import { supabase } from '../config/supabase.js';

export const getReviews = async (req, res, next) => {
  try {
    const { revieweeId } = req.query;

    if (!revieweeId) {
      return res.status(400).json({ message: 'revieweeId query param is required.' });
    }

    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:users!reviews_reviewer_id_fkey(id, full_name, avatar_url)
      `)
      .eq('reviewee_id', revieweeId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getReviews error:', error.message);
      return res.status(500).json({ message: error.message });
    }

    res.json(data || []);
  } catch (error) {
    next(error);
  }
};

export const submitReview = async (req, res, next) => {
  try {
    const { reviewerId, revieweeId, petId, rating, comment } = req.body;
    const uid = reviewerId || req.user.id;

    if (!revieweeId || !rating) {
      return res.status(400).json({ message: 'revieweeId and rating are required.' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        reviewer_id: uid,
        reviewee_id: revieweeId,
        pet_id: petId || null,
        rating,
        comment: comment || ''
      }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const getAverageRating = async (req, res, next) => {
  try {
    const { revieweeId } = req.query;

    if (!revieweeId) {
      return res.status(400).json({ message: 'revieweeId query param is required.' });
    }

    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('reviewee_id', revieweeId);

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    const reviews = data || [];
    const count = reviews.length;
    const average = count > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / count
      : 0;

    res.json({ average: Math.round(average * 10) / 10, count });
  } catch (error) {
    next(error);
  }
};
