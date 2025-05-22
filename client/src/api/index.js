import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api', // adjust your server URL here
});

// Signup
export const signup = (data) => API.post('auth/signup', data);

// Login
export const login = (data) => API.post('auth/login', data);

export default API;
