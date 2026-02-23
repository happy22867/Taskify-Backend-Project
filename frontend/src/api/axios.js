import axios from "axios";

const instance = axios.create({
  baseURL: "https://taskify-backend-project-2.onrender.com/api/v1",
  withCredentials: true
});

export default instance;