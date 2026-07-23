import { supabase } from '../config/supabase.js';

export const getNotifications = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const uid = userId || req.user.id;

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getNotifications error:', error.message);
      return res.status(500).json({ message: error.message });
    }

    res.json(data || []);
  } catch (error) {
    next(error);
  }
};

export const createNotification = async (req, res, next) => {
  try {
    const { userId, title, body, type } = req.body;

    if (!userId || !title || !body) {
      return res.status(400).json({ message: 'userId, title, and body are required.' });
    }

    const { data, error } = await supabase
      .from('notifications')
      .insert([{
        user_id: userId,
        title,
        body,
        type: type || 'info',
        read: false
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

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Notification not found.' });
      }
      return res.status(400).json({ message: error.message });
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const uid = userId || req.user.id;

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', uid)
      .eq('read', false);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json({ message: 'All notifications marked as read.' });
  } catch (error) {
    next(error);
  }
};
