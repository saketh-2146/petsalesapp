import { supabase } from '../config/supabase.js';

export const getFavorites = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const uid = userId || req.user.id;

    const { data, error } = await supabase
      .from('favorites')
      .select('pet_id')
      .eq('user_id', uid);

    if (error) {
      console.error('getFavorites error:', error.message);
      return res.status(500).json({ message: error.message });
    }

    // Return array of pet IDs for frontend compatibility
    const petIds = (data || []).map(f => f.pet_id);
    res.json(petIds);
  } catch (error) {
    next(error);
  }
};

export const addFavorite = async (req, res, next) => {
  try {
    const { userId, petId } = req.body;
    const uid = userId || req.user.id;

    if (!petId) {
      return res.status(400).json({ message: 'petId is required.' });
    }

    const { data, error } = await supabase
      .from('favorites')
      .insert([{ user_id: uid, pet_id: petId }])
      .select()
      .single();

    if (error) {
      // Handle duplicate — user already favorited this pet
      if (error.code === '23505') {
        return res.json({ message: 'Already favorited.' });
      }
      return res.status(400).json({ message: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const { userId, petId } = req.query;
    const uid = userId || req.user.id;

    if (!petId) {
      return res.status(400).json({ message: 'petId query param is required.' });
    }

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', uid)
      .eq('pet_id', petId);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
