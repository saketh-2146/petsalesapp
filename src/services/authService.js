import { apiClient } from './apiClient';

class AuthService {
  /** Sign up via Render Backend */
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

  /** Login via Render Backend */
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

  /** Google Sign-In - not supported on frontend yet */
  async signInWithOAuth(provider) {
    return { data: null, error: 'OAuth is handled differently when purely backend-driven. Setup required.' };
  }

  /** Get user profile from backend */
  async getUserProfile(userId) {
    // If backend uses JWT for identification, it might just need /users/me
    return await apiClient.get(`/users/${userId}`);
  }

  /** Update user profile in backend */
  async updateProfile(userId, profileData) {
    return await apiClient.put(`/users/${userId}`, profileData);
  }

  /** Upload avatar to backend */
  async uploadAvatar(userId, file) {
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://petconnect-wxdg.onrender.com/api/users/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      return { url: data.url, error: null };
    } catch (error) {
      return { url: null, error: error.message };
    }
  }

  /** Get all users from backend */
  async getAllUsers() {
    return await apiClient.get('/users');
  }

  /** Send password reset email */
  async resetPassword(email) {
    try {
      const { error } = await apiClient.post('/auth/reset-password', { email });
      return { error };
    } catch (error) {
      return { error: error.message };
    }
  }
}

export const authService = new AuthService();
