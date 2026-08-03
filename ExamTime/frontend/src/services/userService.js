import apiClient from '../config/axios.js';

export const getPublicProfile = async (userId) => {
    const { data } = await apiClient.get(`/users/${userId}/profile`);
    return data;
};
