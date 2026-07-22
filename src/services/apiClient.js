const API_BASE_URL = 'https://petconnect-wxdg.onrender.com/api';

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
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...customHeaders
      }
    });
    return handleResponse(response);
  },

  post: async (endpoint, data, customHeaders = {}) => {
    const headers = getAuthHeaders();
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
  },

  put: async (endpoint, data, customHeaders = {}) => {
    const headers = getAuthHeaders();
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
  },

  delete: async (endpoint, customHeaders = {}) => {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...customHeaders
      }
    });
    return handleResponse(response);
  }
};

async function handleResponse(response) {
  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }
  
  if (!response.ok) {
    return { data: null, error: data?.message || response.statusText };
  }
  return { data, error: null };
}
