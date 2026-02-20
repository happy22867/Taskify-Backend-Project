export default function NotFound() {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      background: "#0f172a",
      color: "#fff",
      fontFamily: "Arial"
    }}>
      <h1 style={{ fontSize: "80px", margin: 0 }}>404</h1>
      <p style={{ fontSize: "20px", margin: "10px 0" }}>
        Page Not Found
      </p>
      <p style={{ opacity: 0.7 }}>
        The page you are looking for doesn't exist.
      </p>
    </div>
  );
}