import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8000/api",
});

// attach token to every request automatically
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("aiprep_token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export default API;