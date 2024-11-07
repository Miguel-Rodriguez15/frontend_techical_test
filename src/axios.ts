import type { AxiosError } from 'axios';

import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
});

const handleAxiosError = (error: AxiosError) => {
  if (axios.isAxiosError(error)) {
    const {response} = error;
    if (response) {
      console.error('Error Response:', response.data);
      return {
        message: (response.data as any).message || 'An error occurred',
        status: response.status,
      };
    } 
      console.error('Network Error:', error.message);
      return {
        message: 'Network Error: Please check your connection.',
        status: null,
      };
    
  } 
    console.error('Unexpected Error:', error);
    return {
      message: 'An unexpected error occurred.',
      status: null,
    };
  
};

axiosInstance.interceptors.request.use(
  config => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      config.headers.Authorization = `Bearer ${storedToken}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const handledError = handleAxiosError(error);
    return Promise.reject(handledError);
  }
);

export default axiosInstance;