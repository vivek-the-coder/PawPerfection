import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response) {
            // Handle specific error codes
            switch (error.response.status) {
                case 401:
                    // Try to refresh token if we haven't already tried
                    if (!originalRequest._retry) {
                        originalRequest._retry = true;

                        const refreshToken = localStorage.getItem('refreshToken');
                        if (refreshToken) {
                            try {
                                const response = await axios.post(
                                    `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/refresh-token`,
                                    { refreshToken }
                                );

                                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
                                localStorage.setItem('accessToken', newAccessToken);
                                localStorage.setItem('refreshToken', newRefreshToken);

                                // Retry original request with new token
                                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                                return api(originalRequest);
                            } catch (refreshError) {
                                // Refresh failed, clear tokens and redirect to login
                                localStorage.removeItem('accessToken');
                                localStorage.removeItem('refreshToken');
                                window.location.href = '/login';
                                return Promise.reject(refreshError);
                            }
                        } else {
                            // No refresh token available
                            localStorage.removeItem('accessToken');
                            localStorage.removeItem('refreshToken');
                            window.location.href = '/login';
                        }
                    }
                    break;
                case 403:
                    // Handle forbidden
                    break;
                case 404:
                    // Handle not found
                    break;
                default:
                    // Handle other errors
                    break;
            }
        }
        return Promise.reject(error);
    }
);

export default api;