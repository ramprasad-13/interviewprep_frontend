// api.js
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast
// This is a placeholder for how you'd get the logout function.
// In a real app, you'd probably have an AuthContext or a global store
// that provides this logout functionality. Since api.js is a utility,
// it doesn't have direct access to React hooks.

// We will create a way to inject the logout function.
let storedLogoutFunction = null;

// Function to set the logout function from a React component (e.g., App.js)
export const setLogoutFunction = (logoutFn) => {
  storedLogoutFunction = logoutFn;
};

const url = 'https://interviewprep-backend.vercel.app'; //backendUrl
//'http://localhost:3000' use it for development

// Create an Axios instance
const api = axios.create({
  baseURL: url,
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors (session expiration)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Session expired or token invalid
      if (storedLogoutFunction) {
        storedLogoutFunction('Your session has expired. Please log in again.');
      } else {
        // Fallback if logout function isn't set (should ideally not happen)
        localStorage.removeItem('token');
        toast.error('Your session has expired. Please log in again.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // You might want to do a window.location.href = '/signin' here if you can't guarantee logout function is set
      }
    }
    return Promise.reject(error);
  }
);

// Helper function to handle common error logging and re-throwing
const handleError = (error, context) => {
  console.error(`Error ${context}:`, error?.response?.data || error.message);
  throw error.response?.data || { error: error.message };
};

// ------------------- Question APIs -------------------
export const getAllQuestions = async (page = 1, limit = 12, query = '') => {
  try {
    const response = await api.get('/api/questions', {
      params: { page, limit, query },
    });
    return response.data;
  } catch (error) {
    handleError(error, 'fetching questions');
  }
};

export const getAllQuestionsWithoutAuth = async (page = 1, limit = 12, query = '') => {
  try {
    const response = await api.get('/api/noauth/questions', {
      params: { page, limit, query },
    });
    return response.data;
  } catch (error) {
    handleError(error, 'fetching questions');
  }
};

export const addQuestion = async (questionData) => {
  try {
    const response = await api.post('/api/questions', {
      ...questionData,
      private: questionData.private || false, // Include private field
    });
    return response.data;
  } catch (error) {
    handleError(error, 'adding question');
  }
};

export const editQuestion = async (id, questionData) => {
  try {
    const response = await api.put(`/api/questions/${id}`, {
      ...questionData,
      private: questionData.private || false, // Include private field
    });
    return response.data;
  } catch (error) {
    handleError(error, 'editing question');
  }
};

export const deleteQuestion = async (id) => {
  try {
    const response = await api.delete(`/api/questions/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, 'deleting question');
  }
};

export const moveQuestionToFolder = async (questionId, folderId) => {
  try {
    const response = await api.patch(
      `/api/questions/${questionId}/move`,
      { folderId: folderId || null }
    );
    return response.data;
  } catch (error) {
    handleError(error, 'moving question');
  }
};

// ------------------- Folder APIs -------------------
export const createFolder = async (folderName) => {
  try {
    const response = await api.post('/api/folders', { name: folderName });
    return response.data;
  } catch (error) {
    handleError(error, 'creating folder');
  }
};

export const getFolders = async () => {
  try {
    const response = await api.get('/api/folders');
    return response.data;
  } catch (error) {
    handleError(error, 'fetching folders');
  }
};

export const getFoldersWithoutAuth = async () => {
  try {
    const response = await api.get('/api/noauth/folders');
    return response.data;
  } catch (error) {
    handleError(error, 'fetching public folders');
  }
};

export const getFolderByIdWithoutAuth = async (folderId) => {
  try {
    const response = await api.get(`/api/noauth/folders/${folderId}`);
    return response.data;
  } catch (error) {
    handleError(error, 'fetching folder by ID (public)');
  }
};

export const deleteFolder = async (folderId) => {
  try {
    const response = await api.delete(`/api/folders/${folderId}`);
    return response.data;
  } catch (error) {
    handleError(error, 'deleting folder');
  }
};

// ------------------- Auth APIs -------------------
export const signUp = async ({ fullName, gender, age, mobileNumber, email, password }) => {
  try {
    const response = await axios.post(`${url}/api/auth/signup`, { // Use axios directly for signup as it doesn't need authHeader initially
      fullName,
      gender,
      age,
      mobileNumber,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    handleError(error, 'signing up');
  }
};

export const login = async ({ email, password }) => {
  try {
    const response = await axios.post(`${url}/api/auth/login`, { email, password }); // Use axios directly for login
    return response.data;
  } catch (error) {
    handleError(error, 'logging in');
  }
};

// ------------------- OTP Auth -------------------
export const requestOTP = async ({ email }) => {
  try {
    const response = await axios.post(`${url}/api/auth/request-otp`, { email });
    return response.data;
  } catch (error) {
    handleError(error, 'requesting OTP');
  }
};

export const verifyOTP = async ({ email, otp }) => {
  try {
    const response = await axios.post(`${url}/api/auth/verify-otp`, { email, otp });
    return response.data;
  } catch (error) {
    handleError(error, 'verifying OTP');
  }
};

// ------------------- Authenticated User APIs -------------------
export const getUserProfile = async () => {
  try {
    const response = await api.get('/api/profile');
    return response.data;
  } catch (error) {
    handleError(error, 'fetching profile');
  }
};

// ------------------- Password Reset -------------------
export const forgotPassword = async ({ email }) => {
  try {
    const response = await axios.post(`${url}/api/auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    handleError(error, 'requesting password reset');
  }
};

export const resetPassword = async ({ email, otp, newPassword }) => {
  try {
    const response = await axios.post(`${url}/api/auth/reset-password`, { email, otp, newPassword });
    return response.data;
  } catch (error) {
    handleError(error, 'resetting password');
  }
};

export const getPublicQuestionById = async (id) => {
  try {
    const response = await axios.get(`${url}/api/noauth/questions/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, 'fetching public question by ID');
  }
};