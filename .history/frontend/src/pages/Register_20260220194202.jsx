import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FaApple, FaGoogle, FaFacebookF } from "react-icons/fa";

const IMG = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80";

export default function Register() {
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
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

  const socials = [
    { label: "Apple", icon: <FaApple size={18} color="black" /> },
    { label: "Google", icon: <FaGoogle size={18} color="#4285F4" /> },
    { label: "Facebook", icon: <FaFacebookF size={18} color="#1877F2" /> },
  ];

  const inp = {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 18px",
    background: "#f5f5f5",
    border: "none",
    color: "black",
    borderRadius: "50px",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s ease"
  };

  return (
    <>
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
          width: 480px;
          min-width: 420px;
          padding: 14px;
        }
        button:focus {
          outline: none !important;
          box-shadow: none !important;
        }
        input:focus {
          outline: none !important;
          box-shadow: none !important;
        }
        @media (max-width: 700px) {
          .register-img-panel { display: none; }
          .register-card { max-width: 400px; }
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `url(${IMG}) center/cover no-repeat`,
        padding: 24
      }}>

        <div className="register-card">

          <div style={{ flex: 1, padding: "50px 44px", display: "flex", flexDirection: "column", justifyContent: "center" }}>

            <div style={{ fontSize: 21, fontWeight: 700, color: "#4a7a3a", fontStyle: "italic", marginBottom: 16 }}>
              TaskApp
            </div>

            <h1 style={{ fontSize: 32, color: "black", fontWeight: 800, marginBottom: 32 }}>
              Create Your<br />Taskify <br /> Account
            </h1>

            {/* SOCIAL ICONS */}
            <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
              {socials.map(s => (
                <button
                  key={s.label}
                  title={s.label}
                  style={{
                    width: 62,
                    height: 62,
                    borderRadius: "50%",
                    background: "#f3f3f3",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    outline: "none",
                    transition: "0.3s"
                  }}
                  onMouseOver={e => e.currentTarget.style.background = "#e0e0e0"}
                  onMouseOut={e => e.currentTarget.style.background = "#f3f3f3"}
                >
                  {s.icon}
                </button>
              ))}
            </div>

            <div style={{ color: "#aaa", marginBottom: 16 }}>or</div>

            {/* FORM */}
            <form onSubmit={handleSubmit} autoComplete="off" style={{ display: "flex", flexDirection: "column", gap: 11, maxWidth: 300 }}>

              {/* NAME */}
              <input
                placeholder="Full name"
                value={data.name}
                autoComplete="off"
                onChange={e => setData({ ...data, name: e.target.value })}
                style={inp}
                onMouseOver={e => {
                  e.target.style.background = "#eaeaea";
                  e.target.style.transform = "scale(1.02)";
                }}
                onMouseOut={e => {
                  e.target.style.background = "#f5f5f5";
                  e.target.style.transform = "scale(1)";
                }}
              />

              {/* EMAIL */}
              <input
                type="email"
                placeholder="Email"
                autoComplete="new-email"
                value={data.email}
                onChange={e => setData({ ...data, email: e.target.value })}
                style={inp}
                onMouseOver={e => {
                  e.target.style.background = "#eaeaea";
                  e.target.style.transform = "scale(1.02)";
                }}
                onMouseOut={e => {
                  e.target.style.background = "#f5f5f5";
                  e.target.style.transform = "scale(1)";
                }}
              />

              {/* PASSWORD */}
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  autoComplete="new-password"
                  value={data.password}
                  onChange={e => setData({ ...data, password: e.target.value })}
                  style={{ ...inp, paddingRight: 44 }}
                  onMouseOver={e => {
                    e.target.style.background = "#eaeaea";
                    e.target.style.transform = "scale(1.02)";
                  }}
                  onMouseOut={e => {
                    e.target.style.background = "#f5f5f5";
                    e.target.style.transform = "scale(1)";
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    color:"black",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    outline: "none"
                  }}
                >
                  👁
                </button>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                style={{
                  padding: 15,
                  background: "#3d6b30",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50px",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  marginTop: 4,
                  transition: "0.3s"
                }}
                onMouseOver={e => {
                  e.target.style.background = "#2f5225";
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseOut={e => {
                  e.target.style.background = "#3d6b30";
                  e.target.style.transform = "scale(1)";
                }}
              >
                Create Account
              </button>

            </form>

            <p style={{ fontSize: 16, color: "#888", marginTop: 16 }}>
              Already have an account?{" "}
              <span onClick={() => navigate("/")} style={{ fontWeight: 700, cursor: "pointer", color: "#1a1a1a" }}>
                Log in
              </span>
            </p>
          </div>

          <div className="register-img-panel">
            <img src={IMG} alt="bg" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 16 }} />
          </div>

        </div>
      </div>
    </>
  );
}