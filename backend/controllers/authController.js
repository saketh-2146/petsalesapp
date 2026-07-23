import { supabase } from '../config/supabase.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({ message: error.message });
    }

    // Fetch the extended profile
    let userProfile = { id: data.user.id, email: data.user.email };
    const { data: profile } = await supabase.from('users').select('*').eq('id', data.user.id).single();
    if (profile) userProfile = { ...userProfile, ...profile };

    res.json({ token: data.session.access_token, user: userProfile });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const { email, password, full_name, phone, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name }
      }
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Try to insert extended profile if user created
    if (data.user) {
      const { error: profileError } = await supabase.from('users').insert({
        id: data.user.id,
        email,
        full_name,
        phone,
        role: role || 'Buyer',
        avatar_url: ''
      });
      if (profileError) console.warn('Failed to insert user profile:', profileError.message);
    }

    res.status(201).json({ 
      token: data.session?.access_token, 
      user: { id: data.user?.id, email, full_name, phone, role }
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/reset`
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json({ message: 'Password reset email sent. Please check your inbox.' });
  } catch (error) {
    next(error);
  }
};
