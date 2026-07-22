import { supabase } from '../config/supabase.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. Please login.' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token with Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      console.warn('Invalid token:', error?.message);
      return res.status(401).json({ message: 'Invalid or expired session. Please login again.' });
    }

    // Attach user to request object
    req.user = data.user;
    next();
  } catch (error) {
    next(error);
  }
};
