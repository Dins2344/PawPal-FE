import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

// ─── Request Interceptor ────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
    (config) => {
        // Attach the JWT token to every outgoing request if it exists
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ─── Response Interceptor ───────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
    (response) => {
        // Simply return the response for successful requests
        return response;
    },
    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            // Token expired or invalid — clear auth and redirect to login
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // Only redirect if not already on login/register page
            const currentPath = window.location.pathname;
            if (currentPath !== "/login" && currentPath !== "/register") {
                window.location.href = "/login";
            }
        }

        if (status === 403) {
            console.error("Access forbidden: You do not have permission.");
        }

        if (status === 500) {
            console.error("Server error: Something went wrong on the server.");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
