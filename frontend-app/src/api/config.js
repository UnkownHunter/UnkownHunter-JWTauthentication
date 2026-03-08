// src/api/config.js
// Centralized configuration for API endpoints

const BASE_URL = 'http://localhost:8000'; // Default FastAPI port from typical setups

export const endpoints = {
    auth: {
        login: `${BASE_URL}/auth/login`,
        // register is not in the provided main.py, but usually it exists
        register: `${BASE_URL}/auth/register`,
        me: `${BASE_URL}/auth/users/me`,
    },
    tasks: {
        base: `${BASE_URL}/tasks`,
    }
};

// Helper to get auth header
export const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Generic fetch wrapper to handle JSON and errors
export const apiFetch = async (url, options = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers,
    };

    try {
        const response = await fetch(url, { ...options, headers });

        // If unauthorized, you might want to clear token and redirect to login
        if (response.status === 401) {
            localStorage.removeItem('access_token');
            // A more robust implementation would use an event emitter or interceptor
            window.location.href = '/login';
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || errorData.message || 'An error occurred');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};
