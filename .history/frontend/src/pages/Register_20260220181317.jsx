import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FaApple, FaGoogle, FaFacebookF } from "react-icons/fa";

const IMG = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80";

export default function Register() {
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // original logic - untouched
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

  const socials = [
    { label: "Apple",    icon: <FaApple size={18} /> },
    { label: "Google",   icon: <FaGoogle size={18} color="#4285F4" /> },
    { label: "Facebook", icon: <FaFacebookF size={18} color="#1877F2" /> },
  ];

  const inp = {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 18px",
    background: "#f5f5f5",
    border: "none",
    borderRadius: "50px",
    fontSize: "14px",
    outline: "none",
  };

  return (
    <>
      {/* responsive styles inject karo */}
      <style>{`
        .register-card {
          display: flex;
          width: 100%;
          max-width: 860px;
          min-height: 540px;
          background: #fff;
          border-radius: 26px;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,.4);
        }
        .register-img-panel {
          width: 420px;
          min-width: 420px;
          padding: 14px;
        }
        /* chhoti screen pe image panel hide karo */
        @media (max-width: 700px) {
          .register-img-panel { display: none; }
          .register-card { max-width: 400px; }
        }
      `}</style>

      {/* full page background */}
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `url(${IMG}) center/cover no-repeat`,
        padding: 24,
        boxSizing: "border-box"
      }}>

        <div className="register-card">

         
          <div style={{ flex: 1, padding: "50px 44px", display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>

           
            <div style={{ fontSize: 21, fontWeight: 700, color: "#4a7a3a", fontStyle: "italic", marginBottom: 16 }}>
              TaskApp
            </div>

            <h1 style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.2, marginBottom: 32, margin: "0 0 32px 0" }}>
              Create Your<br />Account
            </h1>

            
            <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
              {socials.map(s => (
                <button key={s.label} title={s.label} style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: "#f3f3f3", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {s.icon}
                </button>
              ))}
            </div>

            <div style={{ color: "#aaa", fontSize: 13, marginBottom: 16 }}>or</div>

           
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 11, maxWidth: 300 }}>

              <input
                placeholder="Full name"
                value={data.name}
                onChange={e => setData({ ...data, name: e.target.value })}
                style={inp}
              />

              <input
                type="email"
                placeholder="Email"
                value={data.email}
                onChange={e => setData({ ...data, email: e.target.value })}
                style={inp}
              />

              
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={data.password}
                  onChange={e => setData({ ...data, password: e.target.value })}
                  style={{ ...inp, paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#888", display: "flex" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>

              <button type="submit" style={{
                padding: 15, background: "#3d6b30", color: "#fff",
                border: "none", borderRadius: "50px", fontSize: 15,
                fontWeight: 600, cursor: "pointer", marginTop: 4
              }}>
                Create Account
              </button>
            </form>

            <p style={{ fontSize: 13, color: "#888", marginTop: 16 }}>
              Already have an account?{" "}
              <span onClick={() => navigate("/")} style={{ fontWeight: 700, cursor: "pointer", color: "#1a1a1a" }}>
                Log in
              </span>
            </p>
          </div>

          {/* right - image panel */}
          <div className="register-img-panel">
            <img src={IMG} alt="background" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 16 }} />
          </div>

        </div>
      </div>
    </>
  );
}