import axios from './axios.js';

export const registerRequest = (user) => axios.post('/register', user);

export const loginRequest = (user) => axios.post('/login', user);

export const logoutRequest = () => axios.post('/logout');

export const verifyTokenRequest = () => axios.get('/verify-token');

export const forgotPasswordRequest = (user) => axios.post('/forgot-password', user);

export const resetPasswordRequest = (user, token) => axios.post(`/reset-password/${token}`, user);
