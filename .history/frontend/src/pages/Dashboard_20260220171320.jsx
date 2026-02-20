import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  // localStorage se user info lo
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;

  const headers = { Authorization: `Bearer ${token}` };

  // Route protect karo - agar token nahi toh login pe bhejo
  useEffect(() => {
    if (!token) {
      window.location = "/";
    }
  }, []);

  // Saare tasks fetch karo
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/tasks", { headers });
      setTasks(res.data);
    } catch (err) {
      alert("Tasks load karne mein error aaya");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Naya task add karne ke liye form kholo
  const openAddForm = () => {
    setForm({ title: "", description: "" });
    setEditId(null);
    setShowForm(true);
  };

  // Task edit karne ke liye form kholo aur purana data daal do
  const openEditForm = (task) => {
    setForm({ title: task.title, description: task.description });
    setEditId(task._id);
    setShowForm(true);
  };

  // Form submit - add ya update dono handle karta hai
  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      return alert("Title aur description dono bharo");
    }

    try {
      if (editId) {
        await axios.put(`/tasks/${editId}`, form, { headers });
      } else {
        await axios.post("/tasks", form, { headers });
      }
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      alert("Kuch galat ho gaya, dobara try karo");
    }
  };

  // Task delete karo (sirf admin ke liye)
  const deleteTask = async (id) => {
    if (!window.confirm("Kya sach mein delete karna chahte ho?")) return;
    try {
      await axios.delete(`/tasks/${id}`, { headers });
      fetchTasks();
    } catch (err) {
      alert("Delete nahi hua");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    window.location = "/";
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Top header bar */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.appTitle}>Task Manager</h1>
            <p style={styles.welcomeText}>Welcome, <strong>{user?.name || "User"}</strong></p>
          </div>
          <div style={styles.headerRight}>
            {/* Role badge - admin ko red, user ko blue */}
            <span style={{
              ...styles.roleBadge,
              background: role === "admin" ? "#fee2e2" : "#dbeafe",
              color: role === "admin" ? "#dc2626" : "#2563eb",
              border: `1px solid ${role === "admin" ? "#fca5a5" : "#93c5fd"}`
            }}>
              {role === "admin" ? "🔑 Admin" : "👤 User"}
            </span>
            <button style={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Admin ko special message dikhao */}
        {role === "admin" && (
          <div style={styles.adminBanner}>
            🔥 Admin mode - Aap saare tasks delete kar sakte ho
          </div>
        )}

        {/* Add task button */}
        <button style={styles.addBtn} onClick={openAddForm}>
          + Naya Task Add Karo
        </button>

        {/* Loading state */}
        {loading && <p style={{ textAlign: "center", color: "#6b7280" }}>Loading tasks...</p>}

        {/* Tasks list */}
        {!loading && tasks.length === 0 && (
          <div style={styles.emptyState}>
            <p>Koi task nahi hai abhi</p>
            <p style={{ fontSize: "13px", color: "#9ca3af" }}>Upar button se naya task banao</p>
          </div>
        )}

        {tasks.map((task) => (
          <div key={task._id} style={styles.taskCard}>
            <div style={styles.taskContent}>
              {/* Task title */}
              <h3 style={styles.taskTitle}>{task.title}</h3>
              {/* Task description */}
              <p style={styles.taskDesc}>{task.description}</p>
            </div>

            {/* Action buttons */}
            <div style={styles.taskActions}>
              <button
                style={styles.updateBtn}
                onClick={() => openEditForm(task)}
              >
                ✏️ Update
              </button>

              {/* Delete button sirf admin dekh sakta hai */}
              {role === "admin" && (
                <button
                  style={styles.deleteBtn}
                  onClick={() => deleteTask(task._id)}
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal - task add/edit karne ke liye */}
      {showForm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>
              {editId ? "Task Update Karo" : "Naya Task Banao"}
            </h2>

            <label style={styles.label}>Title</label>
            <input
              style={styles.input}
              placeholder="Task ka naam likho"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <label style={styles.label}>Description</label>
            <textarea
              style={{ ...styles.input, height: "80px", resize: "vertical" }}
              placeholder="Kya karna hai describe karo"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
              <button style={styles.saveBtn} onClick={handleSubmit}>
                {editId ? "Update Karo" : "Save Karo"}
              </button>
              <button style={styles.cancelBtn} onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    fontFamily: "'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: "640px",
    margin: "0 auto",
    padding: "30px 20px",
  },

  // Header
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  },
  appTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
    margin: 0,
  },
  welcomeText: {
    color: "#64748b",
    fontSize: "14px",
    margin: "4px 0 0",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  roleBadge: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },
  logoutBtn: {
    padding: "6px 14px",
    background: "transparent",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    color: "#475569",
  },

  // Admin banner
  adminBanner: {
    background: "#fef3c7",
    border: "1px solid #fbbf24",
    color: "#92400e",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
  },

  // Add button
  addBtn: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "20px",
  },

  // Task cards
  taskCard: {
    background: "#fff",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0",
  },
  taskContent: {
    flex: 1,
    marginRight: "12px",
  },
  taskTitle: {
    margin: "0 0 6px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e293b",
  },
  taskDesc: {
    margin: 0,
    fontSize: "14px",
    color: "#64748b",
    lineHeight: "1.5",
  },
  taskActions: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  updateBtn: {
    padding: "6px 12px",
    background: "#eff6ff",
    color: "#2563eb",
    border: "1px solid #bfdbfe",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    whiteSpace: "nowrap",
  },
  deleteBtn: {
    padding: "6px 12px",
    background: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    whiteSpace: "nowrap",
  },

  // Empty state
  emptyState: {
    textAlign: "center",
    padding: "40px",
    color: "#6b7280",
    background: "#fff",
    borderRadius: "10px",
    border: "1px dashed #d1d5db",
  },

  // Modal
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px",
    width: "360px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },
  modalTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 8px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
  },
  input: {
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "7px",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    fontFamily: "inherit",
  },
  saveBtn: {
    flex: 1,
    padding: "10px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "7px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  cancelBtn: {
    flex: 1,
    padding: "10px",
    background: "#f1f5f9",
    color: "#475569",
    border: "1px solid #e2e8f0",
    borderRadius: "7px",
    fontSize: "14px",
    cursor: "pointer",
  },
};