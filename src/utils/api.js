import axios from 'axios';

const url = 'https://interviewprep-backend.vercel.app'; //backendUrl

// Automatically attach token from localStorage
const authHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ------------------- Question APIs -------------------
export const getAllQuestions = async (page = 1, limit = 10, query = '') => {
  try {
    const response = await axios.get(`${url}/api/questions`, {
      params: { page, limit, query },
      ...authHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error?.response?.data || error.message);
    throw error.response?.data || { error: error.message };
  }
};

export const getAllQuestionsWithoutAuth = async (page = 1, limit = 10, query = '') => {
  try {
    const response = await axios.get(`${url}/api/noauth/questions`, {
      params: { page, limit, query },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error?.response?.data || error.message);
    throw error.response?.data || { error: error.message };
  }
};

export const addQuestion = async (questionData) => {
  try {
    const response = await axios.post(`${url}/api/questions`, {
      ...questionData,
      private: questionData.private || false, // Include private field
    }, authHeader());
    return response.data;
  } catch (error) {
    console.error('Error adding question:', error?.response?.data || error.message);
    throw error.response?.data || { error: error.message };
  }
};

export const editQuestion = async (id, questionData) => {
  try {
    const response = await axios.put(`${url}/api/questions/${id}`, {
      ...questionData,
      private: questionData.private || false, // Include private field
    }, authHeader());
    return response.data;
  } catch (error) {
    console.error('Error editing question:', error?.response?.data || error.message);
    throw error.response?.data || { error: error.message };
  }
};

export const deleteQuestion = async (id) => {
  try {
    const response = await axios.delete(`${url}/api/questions/${id}`, authHeader());
    return response.data;
  } catch (error) {
    console.error('Error deleting question:', error?.response?.data || error.message);
    throw error.response?.data || { error: error.message };
  }
};

export const moveQuestionToFolder = async (questionId, folderId) => {
  try {
    const response = await axios.patch(
      `${url}/api/questions/${questionId}/move`,
      { folderId: folderId || null },
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Error moving question:', error?.response?.data || error.message);
    throw error.response?.data || { error: error.message };
  }
};

// ------------------- Folder APIs -------------------
export const createFolder = async (folderName) => {
  try {
    const response = await axios.post(`${url}/api/folders`, { name: folderName }, authHeader());
    return response.data;
  } catch (error) {
    console.error('Error creating folder:', error?.response?.data || error.message);
    throw error.response?.data || { error: error.message };
  }
};

export const getFolders = async () => {
  try {
    const response = await axios.get(`${url}/api/folders`, authHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching folders:', error?.response?.data || error.message);
    throw error.response?.data || { error: error.message };
  }
};

export const getFoldersWithoutAuth = async () => {
  try {
    const response = await axios.get(`${url}/api/noauth/folders`);
    return response.data;
  } catch (error) {
    console.error('Error fetching public folders:', error?.response?.data || error.message);
    throw error.response?.data || { error: error.message };
  }
};

export const getFolderByIdWithoutAuth = async (folderId) => {
  try {
    const response = await axios.get(`${url}/api/noauth/folders/${folderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching folder by ID (public):', error?.response?.data || error.message);
    throw error.response?.data || { error: error.message };
  }
};

export const deleteFolder = async (folderId) => {
  try {
    const response = await axios.delete(`${url}/api/folders/${folderId}`, authHeader());
    return response.data;
  } catch (error) {
    console.error('Error deleting folder:', error?.response?.data || error.message);
    throw error.response?.data || { error: error.message };
  }
};

// ------------------- Auth APIs -------------------
export const signUp = async ({ fullName, gender, age, mobileNumber, email, password }) => {
  try {
    const response = await axios.post(`${url}/api/auth/signup`, {
      fullName,
      gender,
      age,
      mobileNumber,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error signing up:', error?.response?.data || error.message);
    throw error.response?.data || { error: error.message };
  }
};

export const login = async ({ email, password }) => {
  try {
    const response = await axios.post(`${url}/api/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error?.response?.data || error.message);
    throw error.response?.data || { error: error.message };
  }
};

// ------------------- OTP Auth -------------------
export const requestOTP = async ({ email }) => {
  try {
    const response = await axios.post(`${url}/api/auth/request-otp`, { email });
    return response.data;
  } catch (error) {
    console.error('Error requesting OTP:', error?.response?.data || error.message);
    throw error.response?.data || { error: error.message };
  }
};

export const verifyOTP = async ({ email, otp }) => {
  try {
    const response = await axios.post(`${url}/api/auth/verify-otp`, { email, otp });
    return response.data;
  } catch (error) {
    console.error('Error verifying OTP:', error?.response?.data || error.message);
    throw error.response?.data || { error: error.message };
  }
};

// ------------------- Authenticated User APIs -------------------
export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${url}/api/profile`, authHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error?.response?.data || error.message);
    throw error.response?.data || { error: error.message };
  }
};

// ------------------- Password Reset -------------------
export const forgotPassword = async ({ email }) => {
  try {
    const response = await axios.post(`${url}/api/auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    console.error('Error requesting password reset:', error?.response?.data || error.message);
    throw error.response?.data || { error: error.message };
  }
};

export const resetPassword = async ({ email, otp, newPassword }) => {
  try {
    const response = await axios.post(`${url}/api/auth/reset-password`, { email, otp, newPassword });
    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error?.response?.data || error.message);
    throw error.response?.data || { error: error.message };
  }
};
