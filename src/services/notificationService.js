import {
  collection, doc, addDoc, updateDoc, getDocs,
  query, where, orderBy, limit, serverTimestamp, onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';

class NotificationService {
  /** Fetch all notifications for a user */
  async getNotifications(userId) {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('user_id', '==', userId),
        orderBy('created_at', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching notifications:', error.message);
      return { data: null, error: error.message };
    }
  }

  /** Mark a notification as read */
  async markAsRead(notificationId) {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), { read: true });
      return { data: { id: notificationId }, error: null };
    } catch (error) {
      console.error('Error marking notification as read:', error.message);
      return { data: null, error: error.message };
    }
  }

  /** Mark all notifications as read for a user */
  async markAllAsRead(userId) {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('user_id', '==', userId),
        where('read', '==', false)
      );
      const snapshot = await getDocs(q);
      await Promise.all(snapshot.docs.map(d => updateDoc(d.ref, { read: true })));
      return { error: null };
    } catch (error) {
      console.error('Error marking all notifications as read:', error.message);
      return { error: error.message };
    }
  }

  /** Create a new notification */
  async createNotification(userId, title, body, type = 'info') {
    try {
      const docRef = await addDoc(collection(db, 'notifications'), {
        user_id: userId,
        title,
        body,
        type,
        read: false,
        created_at: serverTimestamp(),
      });
      return { data: { id: docRef.id }, error: null };
    } catch (error) {
      console.error('Error creating notification:', error.message);
      return { data: null, error: error.message };
    }
  }

  /** Subscribe to real-time notifications for a user */
  subscribeToNotifications(userId, callback) {
    const q = query(
      collection(db, 'notifications'),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc')
    );
    return onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(data);
    });
  }
}

export const notificationService = new NotificationService();
