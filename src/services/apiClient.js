const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://petconnect-wxdg.onrender.com/api';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
};

export const apiClient = {
  get: async (endpoint, customHeaders = {}) => {
    const headers = getAuthHeaders();
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
          ...customHeaders
        }
      });
      return handleResponse(response);
    } catch (error) {
      return { data: null, error: error.message || 'Network error' };
    }
  },

  post: async (endpoint, data, customHeaders = {}) => {
    const headers = getAuthHeaders();
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
          ...customHeaders
        },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (error) {
      return { data: null, error: error.message || 'Network error' };
    }
  },

  put: async (endpoint, data, customHeaders = {}) => {
    const headers = getAuthHeaders();
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
          ...customHeaders
        },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (error) {
      return { data: null, error: error.message || 'Network error' };
    }
  },

  delete: async (endpoint, customHeaders = {}) => {
    const headers = getAuthHeaders();
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
          ...customHeaders
        }
      });
      return handleResponse(response);
    } catch (error) {
      return { data: null, error: error.message || 'Network error' };
    }
  },

  // For multipart form uploads (images, avatars)
  upload: async (endpoint, formData) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          // Note: Do NOT set Content-Type for FormData — browser sets it with boundary
        },
        body: formData
      });
      return handleResponse(response);
    } catch (error) {
      return { data: null, error: error.message || 'Network error' };
    }
  }
};

// Export the base URL for services that need direct access
export const getApiBaseUrl = () => API_BASE_URL;

async function handleResponse(response) {
  let data;
  try {
    // Handle 204 No Content
    if (response.status === 204) {
      return { data: null, error: null };
    }
    data = await response.json();
  } catch (err) {
    data = null;
  }
  
  if (!response.ok) {
    return { data: null, error: data?.message || data?.error?.message || response.statusText };
  }
  return { data, error: null };
}
