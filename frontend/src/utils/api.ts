import axios from 'axios';
const api = axios.create({
    baseURL: process.env.VUE_APP_BACKEND_URL,
});
export default api;