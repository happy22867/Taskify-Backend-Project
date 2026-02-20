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

  // localStorage se user ka token aur info lo
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;
  const userId = user?.id || user?._id;

  const headers = { Authorization: `Bearer ${token}` };

  // agar token nahi hai toh login page pe bhejo
  useEffect(() => {
    if (!token) {
      window.location = "/";
    }
  }, []);

  // server se tasks fetch karo
  // admin ko backend saare users ke tasks bhejta hai, normal user ko sirf apne
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

  // naya task add karne ke liye form kholo, fields reset karo
  const openAddForm = () => {
    setForm({ title: "", description: "" });
    setEditId(null);
    setShowForm(true);
  };

  // edit karne ke liye form kholo aur task ka purana data fill karo
  const openEditForm = (task) => {
    setForm({ title: task.title, description: task.description });
    setEditId(task._id);
    setShowForm(true);
  };

  // editId hai toh update karo, warna naya task create karo
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

  // task delete karo - confirm ke baad API call karo
  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`/tasks/${id}`, { headers });
      fetchTasks();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // check karo ki yeh task current user ka hai ya nahi
  const isOwner = (task) => {
    return task.user === userId || task.userId === userId || task.createdBy === userId;
  };

  // sirf owner apna task update kar sakta hai, admin nahi
  const canUpdate = (task) => isOwner(task);

  // admin kisi ka bhi task delete kar sakta hai, owner bhi apna delete kar sakta hai
  const canDelete = (task) => role === "admin" || isOwner(task);

  // localStorage clear karo aur login pe wapas bhejo
  const handleLogout = () => {
    localStorage.clear();
    window.location = "/";
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* top header - title, user name, role badge aur logout */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.appTitle}>Task Manager</h1>
            <p style={styles.welcomeText}>Welcome, <strong>{user?.name || "User"}</strong></p>
          </div>
          <div style={styles.headerRight}>
            {/* role badge - admin ko red dikhao, normal user ko blue */}
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

        {/* sirf admin ko yeh special banner dikhao */}
        {role === "admin" && (
          <div style={styles.adminBanner}>
            🔥 Admin Mode — All users' tasks visible. You can delete any task.
          </div>
        )}

        {/* naya task banane ka button */}
        <button style={styles.addBtn} onClick={openAddForm}>
          + Add New Task
        </button>

        {/* tasks load ho rahe hain tab loading text dikhao */}
        {loading && <p style={{ textAlign: "center", color: "#6b7280" }}>Loading tasks...</p>}

        {/* agar koi task nahi hai toh yeh empty state dikhao */}
        {!loading && tasks.length === 0 && (
          <div style={styles.emptyState}>
            <p>No tasks yet</p>
            <p style={{ fontSize: "13px", color: "#9ca3af" }}>Click the button above to add one</p>
          </div>
        )}

        {/* saare tasks ki list map karo */}
        {tasks.map((task) => (
          <div key={task._id} style={styles.taskCard}>
            <div style={styles.taskContent}>
              {/* task ka title aur description yahan dikhega */}
              <h3 style={styles.taskTitle}>{task.title}</h3>
              <p style={styles.taskDesc}>{task.description}</p>

              {/* admin view mein dikhao ki yeh task kis user ka hai */}
              {role === "admin" && task.userName && (
                <span style={styles.ownerTag}>👤 {task.userName}</span>
              )}
            </div>

            {/* action buttons - canUpdate aur canDelete se control hote hain */}
            <div style={styles.taskActions}>

              {/* update button sirf task owner ko dikhao, admin ko nahi */}
              {canUpdate(task) && (
                <button style={styles.updateBtn} onClick={() => openEditForm(task)}>
                  ✏️ Update
                </button>
              )}

              {/* delete button admin ya task owner dono ko dikhao */}
              {canDelete(task) && (
                <button style={styles.deleteBtn} onClick={() => deleteTask(task._id)}>
                  🗑️ Delete
                </button>
              )}

            </div>
          </div>
        ))}
      </div>

      {/* modal popup - task add karne ya edit karne ke liye */}
      {showForm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>
              {editId ? "Update Task" : "Add New Task"}
            </h2>

            <label style={styles.label}>Title</label>
            <input
              style={styles.input}
              placeholder="Enter task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <label style={styles.label}>Description</label>
            <textarea
              style={{ ...styles.input, height: "80px", resize: "vertical" }}
              placeholder="Describe what needs to be done"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
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

  // header section styles
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

  // admin banner styles
  adminBanner: {
    background: "#fef3c7",
    border: "1px solid #fbbf24",
    color: "#92400e",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
  },

  // add task button
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

  // individual task card styles
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
  // admin view mein task owner ka naam dikhane ke liye tag
  ownerTag: {
    display: "inline-block",
    marginTop: "8px",
    fontSize: "12px",
    color: "#7c3aed",
    background: "#f5f3ff",
    border: "1px solid #ddd6fe",
    borderRadius: "12px",
    padding: "2px 8px",
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

  // empty state jab koi task na ho
  emptyState: {
    textAlign: "center",
    padding: "40px",
    color: "#6b7280",
    background: "#fff",
    borderRadius: "10px",
    border: "1px dashed #d1d5db",
  },

  // modal overlay aur box ke styles
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