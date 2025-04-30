import axios from 'axios';

const API_URL = 'http://localhost:3002/api/posts';

axios.defaults.withCredentials = true;

export const getAllPosts = async (page = 1, limit = 6, category = 'All', fetchAll = false) => {
  try {
    const response = await axios.get(`${API_URL}`, {
      params: { page, limit, category, all: fetchAll }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch posts' };
  }
};

export const getPostById = async (postId) => {
  try {
    const response = await axios.get(`${API_URL}/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch post details' };
  }
};

export const createPost = async (postData) => {
  try {
    const response = await axios.post(`${API_URL}`, postData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create post' };
  }
};

export const updatePost = async (postId, postData) => {
  try {
    const response = await axios.put(`${API_URL}/${postId}`, postData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update post' };
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await axios.delete(`${API_URL}/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete post' };
  }
};

export const addComment = async (postId, commentData) => {
  try {
    const response = await axios.post(`${API_URL}/${postId}/comments`, commentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to add comment' };
  }
};

export const likeComment = async (postId, commentId) => {
  try {
    const response = await axios.post(`${API_URL}/${postId}/comments/${commentId}/like`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to like comment' };
  }
};

export const checkCommentLiked = async (postId, commentId) => {
  try {
    const response = await axios.get(`${API_URL}/${postId}/comments/${commentId}/liked`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to check like status' };
  }
};