import axios from "axios";

// Determine if we're running on localhost or IP
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const serverHost = isLocalhost ? 'localhost' : '192.168.1.27';
const Base_URL = `http://${serverHost}:5001/api/`;

// Log the base URL being used
console.log('API Base URL:', Base_URL);

// Create axios instances
export const publicRequest = axios.create({
    baseURL: Base_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const userRequest = axios.create({
    baseURL: Base_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor for authentication
userRequest.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Token found and added to request:', token.substring(0, 10) + '...');
        } else {
            console.warn('No token found in localStorage - request will be unauthorized');
        }
        // Log the request configuration
        console.log('Request Config:', {
            url: config.url,
            method: config.method,
            headers: {
                ...config.headers,
                Authorization: config.headers.Authorization ? 'Bearer [REDACTED]' : 'None'
            },
            data: config.data
        });
        return config;
    },
    (error) => {
        console.error('Request Interceptor Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
userRequest.interceptors.response.use(
    (response) => {
        console.log('API Response:', {
            url: response.config.url,
            method: response.config.method,
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging public requests
publicRequest.interceptors.response.use(
    (response) => {
        console.log('Public API Response:', {
            url: response.config.url,
            method: response.config.method,
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('Public API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        return Promise.reject(error);
    }
);
