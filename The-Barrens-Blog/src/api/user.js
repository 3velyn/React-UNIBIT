import axios from "axios";
axios.defaults.withCredentials = true;
const API_URL = 'http://localhost:3002/api/users';

export const getUserStats = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/stats/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch user stats' };
    }
}

export const changeAvatar = async (avatarUrl) => {
    try {
        const response = await axios.put(`${API_URL}/update/avatar`, { avatar: avatarUrl });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update avatar' };
    }
}