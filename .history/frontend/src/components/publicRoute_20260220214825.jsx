import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const token = localStorage.getItem("token");

  // agar login hai to auth pages access na kare
  if (token) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}