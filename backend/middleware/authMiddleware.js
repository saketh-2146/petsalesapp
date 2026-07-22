import { supabase } from '../config/supabase.js';

/**
 * Auth middleware that verifies the Bearer token.
 * Works with Supabase JWT tokens (from Supabase Auth).
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. Please login.' });
    }

    const token = authHeader.split(' ')[1];

    // Verify the Supabase JWT token
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      console.warn('Token verification failed:', error?.message || 'No user found');
      return res.status(401).json({ message: 'Invalid or expired session. Please login again.' });
    }

    // Attach user to request
    req.user = data.user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    next(err);
  }
};
