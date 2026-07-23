import { apiClient } from './apiClient';

class AuthService {
  /** Sign up via Backend */
  async signUp(email, password, fullName, phone, role = 'Buyer') {
    try {
      const { data, error } = await apiClient.post('/auth/register', {
        email,
        password,
        full_name: fullName,
        phone: phone || '',
        role,
        avatar_url: '',
      });
      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  /** Login via Backend */
  async login(email, password) {
    try {
      const { data, error } = await apiClient.post('/auth/login', { email, password });
      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  /** Logout */
  async logout() {
    localStorage.removeItem('token');
    return { error: null };
  }

  /** Google Sign-In - placeholder */
  async signInWithOAuth(provider) {
    return { data: null, error: 'OAuth is handled differently when purely backend-driven. Setup required.' };
  }

  /** Get user profile from backend */
  async getUserProfile(userId) {
    return await apiClient.get(`/users/${userId}`);
  }

  /** Update user profile in backend */
  async updateProfile(userId, profileData) {
    return await apiClient.put(`/users/${userId}`, profileData);
  }

  /** Upload avatar via backend */
  async uploadAvatar(userId, file) {
    const formData = new FormData();
    formData.append('avatar', file);

    const { data, error } = await apiClient.upload('/users/avatar', formData);

    if (error) {
      return { url: null, error };
    }

    return { url: data?.url || null, error: null };
  }

  /** Get all users from backend */
  async getAllUsers() {
    return await apiClient.get('/users');
  }

  /** Send password reset email */
  async resetPassword(email) {
    try {
      const { data, error } = await apiClient.post('/auth/reset-password', { email });
      return { data, error };
    } catch (error) {
      return { error: error.message };
    }
  }
}

export const authService = new AuthService();
