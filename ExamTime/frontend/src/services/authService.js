import apiClient from '../config/axios.js'

export async function login(credentials) {
    const { data } = await apiClient.post('/auth/login', credentials);
    return data;
}

export async function register(payload) {
    const { data } = await apiClient.post('/auth/register', payload);
    return data;
}

export async function getCurrentUser() {
    const { data } = await apiClient.get('/auth/me');
    return data;
}

export async function updateProfile(payload) {
    const { data } = await apiClient.put('/auth/profile', payload);
    return data;
}

export async function uploadAvatar(formData) {
    const { data } = await apiClient.post('/auth/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
}

export async function uploadBanner(formData) {
    const { data } = await apiClient.post('/auth/banner', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
}