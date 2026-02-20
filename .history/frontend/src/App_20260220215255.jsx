import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute"; // 👈 add this
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes (login hone ke baad access nahi honge) */}
        <Route path="/" element={<PublicRoute> <Landing /> </PublicRoute>}/>

        <Route path="/login" element={ <PublicRoute> <Login /> </PublicRoute>} />

        <Route   path="/register" element={  <PublicRoute>  <Register /> </PublicRoute>}/>

        {/* Protected Route (login ke bina open nahi hoga) */}
        <Route  path="/dashboard"  element={  <ProtectedRoute>  <Dashboard />  </ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Toast */}
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;