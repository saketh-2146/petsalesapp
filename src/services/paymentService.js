import { apiClient } from './apiClient';

class PaymentService {
  async getTransactions(userId) {
    return await apiClient.get(`/payments/transactions?userId=${userId}`);
  }

  async processPayment(userId, checkoutDetails) {
    return await apiClient.post('/payments/process', { userId, checkoutDetails });
  }

  async addMoneyToWallet(userId, amount) {
    return await apiClient.post('/payments/wallet/add', { userId, amount });
  }

  async getWalletBalance(userId) {
    const res = await apiClient.get(`/payments/wallet?userId=${userId}`);
    return { balance: res.data?.balance || 0, error: res.error };
  }
}

export const paymentService = new PaymentService();
