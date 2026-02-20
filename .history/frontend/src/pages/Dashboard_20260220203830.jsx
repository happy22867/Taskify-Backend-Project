import { useEffect, useState } from "react";
import axios from "../api/axios";

const BG_IMAGE = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=90";

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
        input::placeholder, textarea::placeholder {
          color: #94a3b8 !important;
        }
        input, textarea {
          color: #0f172a !important;
        }
      `}</style>

      <div style={styles.page}>
        <div style={styles.topBar}>
          <div style={styles.topBarContent}>
            <h1 style={styles.logo}>Taskify</h1>
            <div style={styles.userSection}>
              <span style={{
                ...styles.roleBadge,
                background: role === "admin" ? "#fee2e2" : "#dbeafe",
                color: role === "admin" ? "#dc2626" : "#2563eb",
              }}>
                {role === "admin" ? "Admin" : "User"}
              </span>
              <p style={styles.userName}>{user?.name || "User"}</p>
              <button style={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>

        <div style={styles.mainContent}>
          {/* CENTER - Task Cards */}
          <div style={styles.centerPanel}>
            
            {role === "admin" && (
              <div style={styles.adminBanner}>
                ⚙️ Admin Mode — Viewing all users' tasks
              </div>
            )}

            <button style={styles.addBtn} onClick={openAddForm}>
              + Add New Task
            </button>

            <div style={styles.tasksList}>
              {loading && <p style={{ textAlign: "center", color: "#fff" }}>Loading tasks...</p>}

              {!loading && tasks.length === 0 && (
                <div style={styles.emptyState}>
                  <p style={{ fontSize: "20px" }}>📋 No tasks yet</p>
                  <p style={{ fontSize: "16px", marginTop: "6px", opacity: 0.8 }}>Click the button above to create one</p>
                </div>
              )}

              {tasks.map((task) => (
                <div key={task._id} style={styles.taskCard}>
                  <div style={styles.taskLeft}>
                    <h3 style={styles.taskTitle}>{task.title}</h3>
                    <p style={styles.taskDesc}>{task.description}</p>
                    {role === "admin" && task.userName && (
                      <span style={styles.ownerTag}>👤 {task.userName}</span>
                    )}
                  </div>

                  <div style={styles.taskRight}>
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
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>
              {editId ? "Update Task" : "New Task"}
            </h2>

            <label style={styles.label}>Title</label>
            <input
              style={styles.input}
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <label style={styles.label}>Description</label>
            <textarea
              style={{ ...styles.input, minHeight: "80px", resize: "vertical" }}
              placeholder="Task description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <div style={styles.modalButtons}>
              <button style={styles.saveBtn} onClick={handleSubmit}>
                {editId ? "Update" : "Save"}
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
    backgroundImage: `url(${BG_IMAGE})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    overflow: "hidden",
  },

  topBar: {
    background: "rgba(15, 23, 42, 0.85)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    padding: "16px 0",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  topBarContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    fontSize: "30px",
    fontWeight: "800",
    color: "#fff",
    margin: 0,
    letterSpacing: "-0.5px",
  },

  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  roleBadge: {
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },

  userName: {
    color: "#e2e8f0",
    fontSize: "16px",
    margin: 0,
    fontWeight: "600",
  },

  logoutBtn: {
    padding: "7px 14px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "6px",
    color: "#e2e8f0",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
  },

  mainContent: {
    minHeight: "calc(100vh - 60px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "40px 20px",
    overflow: "auto",
  },

  centerPanel: {
    width: "100%",
    maxWidth: "580px",
  },

  adminBanner: {
    background: "rgba(254, 243, 199, 0.2)",
    border: "1px solid rgba(251, 191, 36, 0.4)",
    color: "#fef3c7",
    padding: "12px 16px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "13px",
    fontWeight: "600",
    backdropFilter: "blur(10px)",
  },

  addBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "20px",
    fontWeight: "700",
    cursor: "pointer",
    marginBottom: "20px",
    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.3)",
    transition: "all 0.3s",
  },

  tasksList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  taskCard: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    padding: "18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    transition: "all 0.3s",
  },

  taskLeft: {
    flex: 1,
  },

  taskTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "700",
    color: "#0f172a",
  },

  taskDesc: {
    margin: "8px 0 0",
    fontSize: "13px",
    color: "#475569",
    lineHeight: "1.5",
  },

  ownerTag: {
    display: "inline-block",
    marginTop: "10px",
    fontSize: "11px",
    color: "#7c3aed",
    background: "#f5f3ff",
    border: "1px solid #ddd6fe",
    borderRadius: "12px",
    padding: "4px 10px",
    fontWeight: "600",
  },

  taskRight: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flexShrink: 0,
  },

  updateBtn: {
    padding: "7px 12px",
    background: "rgba(37, 99, 235, 0.1)",
    color: "#2563eb",
    border: "1px solid rgba(37, 99, 235, 0.3)",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  deleteBtn: {
    padding: "7px 12px",
    background: "rgba(220, 38, 38, 0.1)",
    color: "#dc2626",
    border: "1px solid rgba(220, 38, 38, 0.3)",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#fff",
    background: "rgba(0, 0, 0, 0.2)",
    borderRadius: "12px",
    border: "2px dashed rgba(255,255,255,0.3)",
    backdropFilter: "blur(10px)",
  },

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
    boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
  },

  modalTitle: {
    fontSize: "30px",
    fontWeight: "800",
    color: "#0f172a",
    margin: "0 0 20px",
  },

  label: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#475569",
    display: "block",
    marginBottom: "6px",
  },

  input: {
    padding: "11px 12px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "15px",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    fontFamily: "inherit",
    color:"white",
    marginBottom: "16px",
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
  },

  cancelBtn: {
    flex: 1,
    padding: "11px",
    background: "#f1f5f9",
    color: "#475569",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
  },
};