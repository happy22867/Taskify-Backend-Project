import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const BG = "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1600&q=90";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Welcome back! Logging you in...");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      alert(err.response?.data?.msg || "Invalid credentials. Please try again.");
    }
  };

  const inp = {
    width: "100%", padding: "12px 15px", borderRadius: "8px",
    border: "none", fontSize: "14px", outline: "none",
    boxSizing: "border-box", background: "#fff", color: "#1a1a1a",
  };

  return (
    <>
      <style>{`
        input::placeholder {
          color: #999 !important;
        }
        input {
          color: #1a1a1a !important;
        }
      `}</style>
      
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundImage: `url(${BG})`, backgroundSize: "cover", backgroundPosition: "center bottom", fontFamily: "'Arial Narrow', 'Impact', sans-serif" }}>

        <div style={{ width: "920px", borderRadius: "22px", overflow: "hidden", backdropFilter: "blur(2px)", background: "rgba(5,15,30,0.18)", padding: "65px 55px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "40px" }}>

            {/* LEFT */}
            <div style={{ flex: 1, color: "#fff" }}>
              <div style={{ fontSize: "26px", fontWeight: 900, letterSpacing: "2px", fontFamily: "'Arial', sans-serif", display: "block", marginBottom: "16px", color: "#4a7a3a" }}>
                ✓ Taskify
              </div>

              <h1 style={{ fontSize: "68px", fontWeight: 900, lineHeight: 1.0, margin: "0 0 20px 0", textTransform: "uppercase", fontFamily: "'Arial Narrow', 'Impact', sans-serif", letterSpacing: "1px" }}>
                WELCOME<br />BACK
              </h1>
              <p style={{ fontSize: "18px", fontWeight: 600, marginBottom: "10px", lineHeight: 1.5, fontFamily: "'Arial', sans-serif" }}>
                Log in to manage your tasks<br />and boost your productivity.
              </p>
              
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.82)", lineHeight: 1.7, maxWidth: "270px", fontFamily: "'Arial', sans-serif" }}>
                Access your tasks, organize projects,
                and track your progress.
              </p>
            </div>

            {/* RIGHT - form card */}
            <div style={{ width: "340px", flexShrink: 0, background: "rgba(150,165,190,0.30)", backdropFilter: "blur(20px)", borderRadius: "16px", padding: "32px 28px" }}>

              <label style={{ display: "block", fontSize: "13px", color: "#fff", marginBottom: "7px" }}>Email</label>
              <input name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} style={{ ...inp, marginBottom: "16px" }} />

              <label style={{ display: "block", fontSize: "13px", color: "#fff", marginBottom: "7px" }}>Password</label>
              <input name="password" type="password" placeholder="••••••••••••" value={formData.password} onChange={handleChange} style={{ ...inp, marginBottom: "8px" }} />

              <div style={{ textAlign: "right", marginBottom: "18px" }}>
                <a href="/forgot-password" style={{ fontSize: "13px", color: "#fff", textDecoration: "underline" }}>Forgot password?</a>
              </div>

              <button onClick={handleSubmit} style={{ width: "100%", padding: "13px", background: "#2979ff", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 700, letterSpacing: "2px", cursor: "pointer", marginBottom: "18px" }}>
                SIGN IN
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.5)" }} />
                <span style={{ fontSize: "13px", color: "#fff" }}>or</span>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.5)" }} />
              </div>

              <button style={{ width: "100%", padding: "11px", background: "transparent", border: "none", borderRadius: "8px", fontSize: "14px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "18px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>

              <p style={{ textAlign: "center", fontSize: "13px", color: "#fff", margin: 0 }}>
                New to Taskify?{" "}
                <span onClick={() => navigate("/register")} style={{ fontWeight: 700, textDecoration: "underline", cursor: "pointer" }}>Create an Account</span>
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}