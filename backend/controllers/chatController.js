import { supabase } from '../config/supabase.js';

export const getChats = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const uid = userId || req.user.id;

    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        buyer:users!chats_buyer_id_fkey(id, full_name, avatar_url),
        seller:users!chats_seller_id_fkey(id, full_name, avatar_url),
        pet:pets(id, name, images)
      `)
      .or(`buyer_id.eq.${uid},seller_id.eq.${uid}`)
      .order('last_message_time', { ascending: false });

    if (error) {
      console.error('getChats error:', error.message);
      return res.status(500).json({ message: error.message });
    }

    res.json(data || []);
  } catch (error) {
    next(error);
  }
};

export const createOrGetChat = async (req, res, next) => {
  try {
    const { buyerId, sellerId, petId } = req.body;
    const actualBuyerId = buyerId || req.user.id;

    if (!sellerId) {
      return res.status(400).json({ message: 'sellerId is required.' });
    }

    // Check if chat already exists between these users for this pet
    let query = supabase
      .from('chats')
      .select('*')
      .eq('buyer_id', actualBuyerId)
      .eq('seller_id', sellerId);

    if (petId) {
      query = query.eq('pet_id', petId);
    }

    const { data: existing } = await query.maybeSingle();

    if (existing) {
      return res.json(existing);
    }

    // Create new chat
    const { data, error } = await supabase
      .from('chats')
      .insert([{
        buyer_id: actualBuyerId,
        seller_id: sellerId,
        pet_id: petId || null,
        last_message: '',
        unread_count: 0
      }])
      .select()
      .single();

    if (error) {
      console.error('createChat error:', error.message);
      return res.status(400).json({ message: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { id: chatId } = req.params;

    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, full_name, avatar_url)
      `)
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('getMessages error:', error.message);
      return res.status(500).json({ message: error.message });
    }

    res.json(data || []);
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { id: chatId } = req.params;
    const { senderId, text, type } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Message text is required.' });
    }

    const actualSenderId = senderId || req.user.id;

    const { data, error } = await supabase
      .from('messages')
      .insert([{
        chat_id: chatId,
        sender_id: actualSenderId,
        text,
        type: type || 'text'
      }])
      .select()
      .single();

    if (error) {
      console.error('sendMessage error:', error.message);
      return res.status(400).json({ message: error.message });
    }

    // Update the chat's last message
    await supabase
      .from('chats')
      .update({
        last_message: text,
        last_message_time: new Date().toISOString(),
        unread_count: supabase.rpc ? 1 : 1
      })
      .eq('id', chatId);

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const markChatRead = async (req, res, next) => {
  try {
    const { id: chatId } = req.params;

    const { data, error } = await supabase
      .from('chats')
      .update({ unread_count: 0 })
      .eq('id', chatId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};
