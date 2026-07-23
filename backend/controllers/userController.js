import { supabase } from '../config/supabase.js';

export const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // Profile row might not exist yet — return basic info from JWT
      return res.json({ id: userId, email: req.user.email });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, avatar_url, phone, email, role, created_at')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'User not found.' });
      }
      return res.status(500).json({ message: error.message });
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Users can only update their own profile
    if (id !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own profile.' });
    }

    const updates = req.body;

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, avatar_url, email, role, created_at');
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    res.json(data || []);
  } catch (err) {
    next(err);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No avatar file provided.' });
    }

    const userId = req.user.id;
    const fileExt = req.file.originalname.split('.').pop();
    const filePath = `${userId}/avatar.${fileExt}`;

    // Upload to Supabase storage 'avatars' bucket
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true
      });

    if (uploadError) {
      console.error('Avatar upload error:', uploadError.message);
      return res.status(500).json({ message: `Upload failed: ${uploadError.message}` });
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // Update user profile with new avatar URL
    await supabase
      .from('users')
      .update({ avatar_url: publicUrl })
      .eq('id', userId);

    res.json({ url: publicUrl });
  } catch (err) {
    next(err);
  }
};
