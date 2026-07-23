import { supabase } from '../config/supabase.js';

export const getPets = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('pets')
      .select(`
        *,
        owner:users(id, full_name, avatar_url, phone, email)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase getPets error:', JSON.stringify(error));
      // If table doesn't exist, return empty array
      if (error.code === '42P01') {
        console.warn('Table "pets" does not exist yet.');
        return res.json([]);
      }
      // RLS blocking - return empty array instead of crashing
      if (error.code === 'PGRST301' || error.message?.includes('RLS')) {
        console.warn('RLS policy blocking pets fetch:', error.message);
        return res.json([]);
      }
      return res.status(500).json({ message: error.message, code: error.code });
    }

    res.json(data || []);
  } catch (error) {
    console.error('getPets exception:', error.message);
    next(error);
  }
};

export const getPetById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('pets')
      .select(`
        *,
        owner:users(id, full_name, avatar_url, phone, email)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Pet not found.' });
      }
      console.error('Supabase getPetById error:', JSON.stringify(error));
      return res.status(500).json({ message: error.message, code: error.code });
    }

    res.json(data);
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
      .select(`
        *,
        owner:users(id, full_name, avatar_url, phone, email)
      `)
      .single();

    if (error) {
      console.error('Supabase createPet error:', JSON.stringify(error));
      return res.status(400).json({ message: error.message, code: error.code });
    }

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
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Pet not found.' });
      }
      return res.status(400).json({ message: error.message, code: error.code });
    }

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

    if (error) {
      return res.status(400).json({ message: error.message, code: error.code });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
