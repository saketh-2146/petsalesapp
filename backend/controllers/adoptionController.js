import { supabase } from '../config/supabase.js';

export const getAdoptionRequests = async (req, res, next) => {
  try {
    const { requesterId, ownerId } = req.query;
    let query = supabase
      .from('adoption_requests')
      .select(`
        *,
        pet:pets(id, name, images, category, breed, price),
        requester:users!adoption_requests_requester_id_fkey(id, full_name, avatar_url, email, phone)
      `)
      .order('created_at', { ascending: false });

    if (requesterId) {
      query = query.eq('requester_id', requesterId);
    } else if (ownerId) {
      // Get adoption requests for pets owned by this user
      query = query.in('pet_id', 
        supabase.from('pets').select('id').eq('owner_id', ownerId)
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error('getAdoptionRequests error:', error.message);
      return res.status(500).json({ message: error.message });
    }

    res.json(data || []);
  } catch (error) {
    next(error);
  }
};

export const submitAdoptionRequest = async (req, res, next) => {
  try {
    const { requesterId, petId, ownerId, formDetails } = req.body;

    if (!petId) {
      return res.status(400).json({ message: 'petId is required.' });
    }

    const insertData = {
      pet_id: petId,
      requester_id: req.user.id,
      status: 'pending',
      message: formDetails?.message || '',
      housing_type: formDetails?.housing || '',
      has_children: formDetails?.hasChildren || false,
      has_other_pets: formDetails?.hasOtherPets || false,
      timeline: formDetails?.timeline || null
    };

    const { data, error } = await supabase
      .from('adoption_requests')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('submitAdoptionRequest error:', error.message);
      return res.status(400).json({ message: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateAdoptionRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, timelineUpdate } = req.body;

    const updates = {};
    if (status) updates.status = status;
    if (timelineUpdate) updates.timeline = timelineUpdate;

    const { data, error } = await supabase
      .from('adoption_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Adoption request not found.' });
      }
      return res.status(400).json({ message: error.message });
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};
