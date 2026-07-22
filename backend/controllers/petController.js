import { supabase } from '../config/supabase.js';

export const getPets = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('pets')
      .select(`
        *,
        owner:users(id, full_name, avatar_url, phone, email)
      `);

    if (error) {
      // If table doesn't exist or RLS blocks it, return a clear message
      if (error.code === '42P01') {
        console.warn('Table "pets" does not exist yet.');
        return res.json([]);
      }
      throw error;
    }

    res.json(data || []);
  } catch (error) {
    next(error);
  }
};

export const createPet = async (req, res, next) => {
  try {
    const newPet = req.body;
    
    // Ensure the authenticated user is set as the owner
    newPet.owner_id = req.user.id;

    const { data, error } = await supabase
      .from('pets')
      .insert([newPet])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const updatePet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('pets')
      .update(updates)
      .eq('id', id)
      // Optional: Add RLS check like .eq('owner_id', req.user.id) if Supabase RLS isn't fully configured
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const deletePet = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
