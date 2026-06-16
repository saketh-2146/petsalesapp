import {
  collection, doc, addDoc, getDocs, getDoc, updateDoc,
  query, where, orderBy, serverTimestamp, runTransaction
} from 'firebase/firestore';
import { db } from '../firebase';

class PaymentService {
  /**
   * Fetch all transactions for a user
   */
  async getTransactions(userId) {
    try {
      const q = query(
        collection(db, 'transactions'),
        where('user_id', '==', userId),
        orderBy('created_at', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching transactions:', error.message);
      return { data: null, error: error.message };
    }
  }

  /**
   * Record a purchase transaction and deduct from wallet
   */
  async processPayment(userId, checkoutDetails) {
    try {
      let txData = null;
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', userId);
        const userDoc = await transaction.get(userRef);
        
        let currentWallet = 0;
        if (userDoc.exists()) {
          currentWallet = userDoc.data().wallet || 0;
        }

        if (currentWallet < checkoutDetails.total) {
          throw new Error('Insufficient wallet balance');
        }

        // Deduct from wallet
        transaction.set(userRef, { wallet: currentWallet - checkoutDetails.total }, { merge: true });

        // We can't directly add to collection via transaction in the same way, but we can generate a new doc ref
        const newTxRef = doc(collection(db, 'transactions'));
        txData = {
          id: newTxRef.id,
          user_id: userId,
          pet_id: checkoutDetails.petId || null,
          pet_name: checkoutDetails.petName,
          amount: checkoutDetails.total,
          payment_method: checkoutDetails.paymentMethod || 'Credit Card **** 4242',
          status: 'success',
          type: 'debit',
          created_at: new Date() // Since serverTimestamp inside runTransaction might be tricky for immediate return
        };
        transaction.set(newTxRef, txData);
      });

      return { data: txData, error: null };
    } catch (error) {
      console.error('Error processing payment:', error.message);
      return { data: null, error: error.message };
    }
  }

  /**
   * Add money to user wallet
   */
  async addMoneyToWallet(userId, amount) {
    try {
      let txData = null;
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', userId);
        const userDoc = await transaction.get(userRef);
        
        let currentWallet = 0;
        if (userDoc.exists()) {
          currentWallet = userDoc.data().wallet || 0;
        }

        // Add to wallet
        transaction.set(userRef, { wallet: currentWallet + amount }, { merge: true });

        const newTxRef = doc(collection(db, 'transactions'));
        txData = {
          id: newTxRef.id,
          user_id: userId,
          pet_name: 'Wallet Top-Up',
          amount,
          payment_method: 'UPI / Net Banking',
          status: 'success',
          type: 'credit',
          created_at: new Date()
        };
        transaction.set(newTxRef, txData);
      });

      return { data: txData, error: null };
    } catch (error) {
      console.error('Error adding money to wallet:', error.message);
      return { data: null, error: error.message };
    }
  }

  /**
   * Get current wallet balance for a user
   */
  async getWalletBalance(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return { balance: 0, error: null };
      }
      return { balance: userDoc.data().wallet || 0, error: null };
    } catch (error) {
      console.error('Error fetching wallet balance:', error.message);
      return { balance: 0, error: error.message };
    }
  }
}

export const paymentService = new PaymentService();
