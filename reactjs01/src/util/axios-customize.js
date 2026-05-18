import axios from "axios";

// Thiết lập địa chỉ Backend lấy từ file .env.development
const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
});

// Gắn token vào header cho mọi request nếu có
instance.interceptors.request.use(function (config) {
    const localStorageToken = localStorage.getItem('access_token');
    if (localStorageToken) {
        config.headers.Authorization = `Bearer ${localStorageToken}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

export default instance;