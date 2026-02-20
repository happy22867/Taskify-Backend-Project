import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/register", data);
      alert("Registered!");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" onChange={e => setData({...data, name: e.target.value})}/>
      <input placeholder="Email" onChange={e => setData({...data, email: e.target.value})}/>
      <input type="password" placeholder="Password" onChange={e => setData({...data, password: e.target.value})}/>
      <button>Register</button>
    </form>
  );
}