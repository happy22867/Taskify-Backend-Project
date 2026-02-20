import axios from "axios";

const instance = axios.create({
  baseURL: "https://taskify-backend-project.onrender.com/api/v1"
});

export default instance;