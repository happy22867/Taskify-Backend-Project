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
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>

        <input
          style={styles.input}
          placeholder="Name"
          onChange={e => setData({ ...data, name: e.target.value })}
        />

        <input
          style={styles.input}
          placeholder="Email"
          onChange={e => setData({ ...data, email: e.target.value })}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          onChange={e => setData({ ...data, password: e.target.value })}
        />

        <button style={styles.button}>Register</button>

        <p style={styles.linkText}>
          Already have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/")}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f6fa"
  },
  card: {
    width: "320px",
    padding: "25px",
    borderRadius: "10px",
    background: "#fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column"
  },
  title: {
    textAlign: "center",
    marginBottom: "20px"
  },
  input: {
    marginBottom: "12px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none"
  },
  button: {
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    background: "#4CAF50",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold"
  },
  linkText: {
    marginTop: "10px",
    fontSize: "14px",
    textAlign: "center"
  },
  link: {
    color: "blue",
    cursor: "pointer"
  }
};