// API Configuration
const API_BASE_URL = 'https://your-backend-url.railway.app/api'; // Replace with actual backend URL
// For local development: const API_BASE_URL = 'http://localhost:5000/api';

// Generic fetch wrapper
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('adminToken');
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Services API
const servicesAPI = {
    getAll: () => apiRequest('/services'),
    getById: (id) => apiRequest(`/services/${id}`),
    create: (serviceData) => apiRequest('/services', {
        method: 'POST',
        body: JSON.stringify(serviceData)
    }),
    update: (id, serviceData) => apiRequest(`/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(serviceData)
    }),
    delete: (id) => apiRequest(`/services/${id}`, {
        method: 'DELETE'
    })
};

// Gallery API
const galleryAPI = {
    getAll: (params = '') => apiRequest(`/gallery${params}`),
    getById: (id) => apiRequest(`/gallery/${id}`),
    create: (galleryData) => apiRequest('/gallery', {
        method: 'POST',
        body: JSON.stringify(galleryData)
    }),
    update: (id, galleryData) => apiRequest(`/gallery/${id}`, {
        method: 'PUT',
        body: JSON.stringify(galleryData)
    }),
    delete: (id) => apiRequest(`/gallery/${id}`, {
        method: 'DELETE'
    })
};

// Contact API
const contactAPI = {
    submit: (formData) => apiRequest('/contact', {
        method: 'POST',
        body: JSON.stringify(formData)
    }),
    getAll: () => apiRequest('/contact'),
    updateStatus: (id, status) => apiRequest(`/contact/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    }),
    delete: (id) => apiRequest(`/contact/${id}`, {
        method: 'DELETE'
    })
};

// Auth API
const authAPI = {
    login: (credentials) => apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),
    verify: () => apiRequest('/auth/verify')
};