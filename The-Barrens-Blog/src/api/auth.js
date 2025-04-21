import axios from "axios";

const API_URL = 'http://localhost:3002/api/auth';

//Configure axios to send and receive cookies
axios.defaults.withCredentials = true;

export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        // Don't store token in localStorage - rely on cookies only
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Registration Failed' };
    }
};

export const login = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Login failed' };
    }
};

export const logout = async () => {
    try {
        const response = await axios.get(`${API_URL}/logout`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Logout failed' };
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await axios.get(`${API_URL}/me`);
        return response.data;
    } catch (error) {
        if (error.response?.status == 401) {
            return null;
        }
        throw error.response?.data || { message: 'Failed to get user data' }
    }
}