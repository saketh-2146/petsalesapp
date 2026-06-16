import {
  collection, doc, addDoc, getDocs, updateDoc,
  query, orderBy, where, serverTimestamp, onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';

class ChatService {
  /** Fetch all chats for a user (as buyer or seller) */
  async getChats(userId) {
    try {
      // Get chats where user is buyer
      const buyerQ = query(collection(db, 'chats'), where('buyer_id', '==', userId));
      const sellerQ = query(collection(db, 'chats'), where('seller_id', '==', userId));

      const [buyerSnap, sellerSnap] = await Promise.all([getDocs(buyerQ), getDocs(sellerQ)]);

      const chats = [
        ...buyerSnap.docs.map(d => ({ id: d.id, ...d.data() })),
        ...sellerSnap.docs.map(d => ({ id: d.id, ...d.data() })),
      ];
      // Sort by last_message_time descending
      chats.sort((a, b) => (b.last_message_time?.seconds || 0) - (a.last_message_time?.seconds || 0));

      return { data: chats, error: null };
    } catch (error) {
      console.error('Error fetching chats:', error.message);
      return { data: null, error: error.message };
    }
  }

  /** Get or create a chat between buyer and seller for a pet */
  async getOrCreateChat(buyerId, sellerId, petId) {
    try {
      const q = query(
        collection(db, 'chats'),
        where('buyer_id', '==', buyerId),
        where('seller_id', '==', sellerId),
        where('pet_id', '==', petId)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const existing = snapshot.docs[0];
        return { data: { id: existing.id, ...existing.data() }, error: null };
      }

      const docRef = await addDoc(collection(db, 'chats'), {
        buyer_id: buyerId,
        seller_id: sellerId,
        pet_id: petId,
        last_message: '',
        last_message_time: serverTimestamp(),
        unread_count: 0,
        created_at: serverTimestamp(),
      });

      return { data: { id: docRef.id }, error: null };
    } catch (error) {
      console.error('Error getting/creating chat:', error.message);
      return { data: null, error: error.message };
    }
  }

  /** Fetch all messages in a chat */
  async getMessages(chatId) {
    try {
      const q = query(
        collection(db, 'chats', chatId, 'messages'),
        orderBy('created_at', 'asc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching messages:', error.message);
      return { data: null, error: error.message };
    }
  }

  /** Send a message in a chat */
  async sendMessage(chatId, senderId, text, type = 'text') {
    try {
      const msgRef = await addDoc(collection(db, 'chats', chatId, 'messages'), {
        sender_id: senderId,
        text,
        type,
        created_at: serverTimestamp(),
      });

      await updateDoc(doc(db, 'chats', chatId), {
        last_message: text,
        last_message_time: serverTimestamp(),
      });

      return { data: { id: msgRef.id }, error: null };
    } catch (error) {
      console.error('Error sending message:', error.message);
      return { data: null, error: error.message };
    }
  }

  /** Subscribe to real-time messages in a chat */
  subscribeToMessages(chatId, callback) {
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('created_at', 'asc')
    );
    return onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(data);
    });
  }

  /** Subscribe to real-time chat list for a user */
  subscribeToChats(userId, callback) {
    const q = query(collection(db, 'chats'), where('buyer_id', '==', userId));
    return onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(data);
    });
  }

  /** Mark a chat as read (reset unread count) */
  async markChatRead(chatId) {
    try {
      await updateDoc(doc(db, 'chats', chatId), { unread_count: 0 });
      return { error: null };
    } catch (error) {
      console.error('Error marking chat as read:', error.message);
      return { error: error.message };
    }
  }
}

export const chatService = new ChatService();
