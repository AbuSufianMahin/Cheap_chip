/**
 * API Client with improved error handling and CORS support
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

export async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {}),
    },
  };

  try {
    console.log(`[API] ${mergedOptions.method} ${url}`);
    
    const response = await fetch(url, mergedOptions);
    
    // Log response status
    console.log(`[API] Response Status: ${response.status}`);

    // Check if response is ok
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: `HTTP ${response.status}` };
      }
      
      const error = new Error(errorData.message || `HTTP ${response.status}`);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    // Parse response
    const data = await response.json();
    console.log(`[API] Success:`, data);
    return data;
  } catch (error) {
    console.error(`[API] Error on ${endpoint}:`, error);
    
    // Re-throw with better message
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Failed to reach server at ${API_BASE_URL}. Make sure the backend is running.`);
    }
    
    throw error;
  }
}

export async function apiCallJson(endpoint, data, method = 'POST') {
  return apiCall(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}
