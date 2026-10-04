import axios from "axios";

const api = axios.create({
  baseURL: "https://jobconnect-backendapi.onrender.com"
});

export default api;