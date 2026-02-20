import { useEffect, useState } from "react";
import axios from "../api/axios";

const HERO_IMAGE = "https://images.unsplash.com/photo-1507925921917-8101b53b3b0b?w=800&q=90";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;
  const userId = user?.id || user?._id;

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) {
      window.location = "/";
    }
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/tasks", { headers });
      setTasks(res.data);
    } catch (err) {
      alert("Error fetching tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const openAddForm = () => {
    setForm({ title: "", description: "" });
    setEditId(null);
    setShowForm(true);
  };

  const openEditForm = (task) => {
    setForm({ title: task.title, description: task.description });
    setEditId(task._id);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      return alert("Please fill all fields");
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
      alert("Something went wrong");
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`/tasks/${id}`, { headers });
      fetchTasks();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const isOwner = (task) => {
    return task.user === userId || task.userId === userId || task.createdBy === userId;
  };

  const canUpdate = (task) => isOwner(task);

  const canDelete = (task) => role === "admin" || isOwner(task);

  const handleLogout = () => {
    localStorage.clear();
    window.location = "/";
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        input::placeholder, textarea::placeholder {
          color: #a0aec0 !important;
        }
        input, textarea {
          color: #1a202c !important;
        }
        @media (max-width: 1024px) {
          .dashboard-container {
            flex-direction: column !important;
          }
          .right-panel {
            min-height: 300px !important;
          }
        }
      `}</style>

      <div style={styles.page}>
        <div className="dashboard-container" style={styles.mainContainer}>
          
          {/* LEFT PANEL - Tasks */}
          <div style={styles.leftPanel}>
            {/* Header */}
            <div style={styles.header}>
              <div>
                <h1 style={styles.appTitle}>Taskify</h1>
                <p style={styles.welcomeText}>Welcome, <strong>{user?.name || "User"}</strong></p>
              </div>
              <div style={styles.headerRight}>
                <span style={{
                  ...styles.roleBadge,
                  background: role === "admin" ? "#fee2e2" : "#dbeafe",
                  color: role === "admin" ? "#dc2626" : "#2563eb",
                  border: `1px solid ${role === "admin" ? "#fca5a5" : "#93c5fd"}`
                }}>
                  {role === "admin" ? "Admin" : "User"}
                </span>
                <button style={styles.logoutBtn} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>

            {/* Admin Banner */}
            {role === "admin" && (
              <div style={styles.adminBanner}>
                ⚙️ Admin Mode — All users' tasks visible. You can delete any task.
              </div>
            )}

            {/* Add Task Button */}
            <button style={styles.addBtn} onClick={openAddForm}>
              ✚ Add New Task
            </button>

            {/* Tasks List */}
            <div style={styles.tasksList}>
              {loading && <p style={{ textAlign: "center", color: "#6b7280" }}>Loading tasks...</p>}

              {!loading && tasks.length === 0 && (
                <div style={styles.emptyState}>
                  <p style={{ fontSize: "18px", fontWeight: "600" }}>📋 No tasks yet</p>
                  <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "6px" }}>Click the button above to add one</p>
                </div>
              )}

              {tasks.map((task) => (
                <div key={task._id} style={styles.taskCard}>
                  <div style={styles.taskContent}>
                    <h3 style={styles.taskTitle}>{task.title}</h3>
                    <p style={styles.taskDesc}>{task.description}</p>

                    {role === "admin" && task.userName && (
                      <span style={styles.ownerTag}>👤 {task.userName}</span>
                    )}
                  </div>

                  <div style={styles.taskActions}>
                    {canUpdate(task) && (
                      <button style={styles.updateBtn} onClick={() => openEditForm(task)}>
                        ✎ Edit
                      </button>
                    )}

                    {canDelete(task) && (
                      <button style={styles.deleteBtn} onClick={() => deleteTask(task._id)}>
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL - Image */}
          <div className="right-panel" style={styles.rightPanel}>
            <img 
              src={HERO_IMAGE} 
              alt="Taskify Hero" 
              style={styles.heroImage}
            />
            <div style={styles.imageOverlay}>
              <h2 style={styles.overlayTitle}>Stay Productive</h2>
              <p style={styles.overlayText}>Organize, manage, and track your tasks effortlessly</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>
              {editId ? "Update Task" : "Create New Task"}
            </h2>

            <label style={styles.label}>Task Title</label>
            <input
              style={styles.input}
              placeholder="What needs to be done?"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <label style={styles.label}>Description</label>
            <textarea
              style={{ ...styles.input, height: "100px", resize: "vertical" }}
              placeholder="Add more details about this task..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <div style={styles.modalButtons}>
              <button style={styles.saveBtn} onClick={handleSubmit}>
                {editId ? "Update Task" : "Create Task"}
              </button>
              <button style={styles.cancelBtn} onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    overflow: "hidden",
  },

  mainContainer: {
    display: "flex",
    minHeight: "100vh",
    gap: 0,
  },

  // LEFT PANEL
  leftPanel: {
    flex: 1,
    overflow: "auto",
    padding: "32px 28px",
    maxHeight: "100vh",
    background: "#fff",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e2e8f0",
  },

  appTitle: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#0f172a",
    margin: 0,
    letterSpacing: "-0.5px",
  },

  welcomeText: {
    color: "#64748b",
    fontSize: "13px",
    margin: "6px 0 0",
    fontWeight: "500",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  roleBadge: {
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },

  logoutBtn: {
    padding: "7px 14px",
    background: "#f1f5f9",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    color: "#475569",
    fontWeight: "500",
    transition: "all 0.2s",
  },

  adminBanner: {
    background: "#fef3c7",
    border: "1px solid #fbbf24",
    color: "#92400e",
    padding: "12px 14px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },

  addBtn: {
    width: "100%",
    padding: "13px",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    marginBottom: "24px",
    transition: "all 0.2s",
  },

  tasksList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  taskCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    transition: "all 0.2s",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },

  taskContent: {
    flex: 1,
  },

  taskTitle: {
    margin: 0,
    fontSize: "15px",
    fontWeight: "700",
    color: "#0f172a",
  },

  taskDesc: {
    margin: "6px 0 0",
    fontSize: "13px",
    color: "#64748b",
    lineHeight: "1.5",
  },

  ownerTag: {
    display: "inline-block",
    marginTop: "8px",
    fontSize: "11px",
    color: "#7c3aed",
    background: "#f5f3ff",
    border: "1px solid #ddd6fe",
    borderRadius: "12px",
    padding: "3px 8px",
    fontWeight: "600",
  },

  taskActions: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flexShrink: 0,
  },

  updateBtn: {
    padding: "6px 10px",
    background: "#eff6ff",
    color: "#2563eb",
    border: "1px solid #bfdbfe",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap",
    transition: "all 0.2s",
  },

  deleteBtn: {
    padding: "6px 10px",
    background: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap",
    transition: "all 0.2s",
  },

  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#6b7280",
    background: "#f9fafb",
    borderRadius: "10px",
    border: "2px dashed #d1d5db",
  },

  // RIGHT PANEL
  rightPanel: {
    flex: 1,
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    position: "relative",
    overflow: "hidden",
  },

  heroImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
    padding: "40px 32px",
    color: "#fff",
  },

  overlayTitle: {
    fontSize: "32px",
    fontWeight: "800",
    margin: 0,
    letterSpacing: "-0.5px",
  },

  overlayText: {
    fontSize: "15px",
    margin: "10px 0 0",
    opacity: 0.9,
    fontWeight: "500",
  },

  // MODAL
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)",
  },

  modal: {
    background: "#fff",
    borderRadius: "14px",
    padding: "28px",
    width: "420px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
  },

  modalTitle: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#0f172a",
    margin: "0 0 20px",
  },

  label: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#475569",
    display: "block",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  input: {
    padding: "11px 12px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    fontFamily: "inherit",
    marginBottom: "16px",
    transition: "all 0.2s",
  },

  modalButtons: {
    display: "flex",
    gap: "10px",
    marginTop: "24px",
  },

  saveBtn: {
    flex: 1,
    padding: "11px",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  cancelBtn: {
    flex: 1,
    padding: "11px",
    background: "#f1f5f9",
    color: "#475569",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
};