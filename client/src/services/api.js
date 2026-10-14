import axios from "axios";

// withCredentials lets the browser send/receive the HttpOnly auth cookie
const api = axios.create({
  baseURL: "http://localhost:8088",
  withCredentials: true,
});

export default api;
