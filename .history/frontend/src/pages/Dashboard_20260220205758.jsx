import { useEffect, useState } from "react";
import axios from "../api/axios";

const BG_IMAGE = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=90";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ title: "", description: "" });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;
  const userId = user?.id || user?._id;

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { if (!token) window.location = "/"; }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try { const res = await axios.get("/tasks", { headers }); setTasks(res.data); }
    catch { alert("Error fetching tasks"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const openAddForm = () => { setForm({ title: "", description: "" }); setEditId(null); setShowForm(true); };

  const openEditForm = (task) => { setForm({ title: task.title, description: task.description }); setEditId(task._id); setShowForm(true); };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim()) return alert("Please fill all fields");
    try {
      if (editId) await axios.put(`/tasks/${editId}`, form, { headers });
      else await axios.post("/tasks", form, { headers });
      setShowForm(false);
      fetchTasks();
    } catch { alert("Something went wrong"); }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try { await axios.delete(`/tasks/${id}`, { headers }); fetchTasks(); }
    catch { alert("Delete failed"); }
  };

  const isOwner = (task) => task.user === userId || task.userId === userId || task.createdBy === userId;
  const canUpdate = (task) => isOwner(task);
  const canDelete = (task) => role === "admin" || isOwner(task);

  const handleLogout = () => { localStorage.clear(); window.location = "/"; };

  return (
    <>
      <style>{`input::placeholder,textarea::placeholder{color:#94a3b8!important}input,textarea{color:#0f172a!important}`}</style>

      <div style={{ minHeight: "100vh", backgroundImage: `url(${BG_IMAGE})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", fontFamily: "'Inter','Segoe UI'", overflow: "hidden" }}>

        <div style={{ background: "rgba(15,23,42,0.85)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "16px 0", position: "sticky", top: 0, zIndex: 100 }}>

          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>

            <h1 style={{ fontSize: "30px", fontWeight: "800", color: "#fff", margin: 0 }}>Taskify</h1>

            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>

              <span style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", background: role === "admin" ? "#fee2e2" : "#dbeafe", color: role === "admin" ? "#dc2626" : "#2563eb" }}>{role === "admin" ? "Admin" : "User"}</span>

              <p style={{ color: "#e2e8f0", margin: 0 }}>{user?.name || "User"}</p>

              <button onClick={handleLogout} style={{ padding: "7px 14px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", color: "#fff", cursor: "pointer" }}>Logout</button>

            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>

          <div style={{ width: "100%", maxWidth: "580px" }}>

            <button onClick={openAddForm} style={{ width: "100%", padding: "14px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "10px", fontSize: "18px", cursor: "pointer" }}>+ Add Task</button>

            {loading && <p style={{ color: "#fff", textAlign: "center" }}>Loading...</p>}

            {!loading && tasks.map(task => (
              <div key={task._id} style={{ background: "#fff", padding: "16px", marginTop: "10px", borderRadius: "10px", display: "flex", justifyContent: "space-between" }}>

                <div>
                  <h3 style={{ margin: 0 }}>{task.title}</h3>
                  <p style={{ margin: 0 }}>{task.description}</p>
                </div>

                <div style={{ display: "flex", gap: "5px" }}>
                  {canUpdate(task) && <button onClick={() => openEditForm(task)}>Edit</button>}
                  {canDelete(task) && <button onClick={() => deleteTask(task._id)}>Delete</button>}
                </div>

              </div>
            ))}

          </div>
        </div>
      </div>

      {showForm && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center" }}>

          <div style={{ background: "#fff", padding: "20px", borderRadius: "10px", width: "300px" }}>

            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={{ width: "100%", marginBottom: "10px" }} />

            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ width: "100%", marginBottom: "10px" }} />

            <button onClick={handleSubmit}>Save</button>
            <button onClick={() => setShowForm(false)}>Cancel</button>

          </div>
        </div>
      )}
    </>
  );
}