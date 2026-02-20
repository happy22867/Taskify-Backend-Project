import React from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/re");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",

        background: `url('https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=700&q=200')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "20px",
      }}
    >
      {/* Background blur overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          backgroundColor: "rgba(0,0,0,0.15)",
          zIndex: 0,
        }}
      />

      {/* Main card */}
      <div
        style={{
          maxWidth: "800px",
          width: "100%",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Cycle Image Section */}
        <div
          style={{
            position: "relative",
            height: "500px",
            background: `url('https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "40px 30px",
          }}
        >
          {/* Dark gradient overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)",
              zIndex: 1,
            }}
          ></div>

          {/* Text Content */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
            }}
          >
            <h1
              style={{
                color: "white",
                fontSize: "32px",
                fontWeight: "bold",
                lineHeight: "1.2",
                marginBottom: "30px",
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              }}
            >
              Find Your
              <br />
              Perfect <span style={{ color: "#c4f542" }}>Nature Stay</span>
              <br />
              Today.
            </h1>

            {/* Start Button */}
            <button
              onClick={handleStart}
              style={{
                background: "#c4f542",
                color: "#1a2a3a",
                padding: "16px 32px",
                border: "none",
                borderRadius: "50px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "all 0.3s",
                boxShadow: "0 4px 15px rgba(196, 245, 66, 0.4)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(196, 245, 66, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 4px 15px rgba(196, 245, 66, 0.4)";
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 12h8m-4-4l4 4-4 4"></path>
              </svg>
              Start now
              <span style={{ marginLeft: "5px" }}>→→→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;