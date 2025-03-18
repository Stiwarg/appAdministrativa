import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ??  "http://localhost:3309/api";

console.log("🌍 API URL en uso:", API_URL); // Verifica qué URL está tomando

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Para que se envíen cookies con las peticiones
});

export default api;