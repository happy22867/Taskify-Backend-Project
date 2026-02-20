import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/auth/login", data);

      // ✅ FIX (IMPORTANT)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Email"
        onChange={e => setData({ ...data, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={e => setData({ ...data, password: e.target.value })}
      />
      <button>Login</button>
    </form>
  );
}