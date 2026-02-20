import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function Dashboard() {

  // Protect Route
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location = "/";
    }
  }, []);

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const headers = {
    Authorization: `Bearer ${token}`
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get("/tasks", { headers });
      setTasks(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Error fetching tasks");
    }
  };

  const createTask = async () => {
    if (!title) return alert("Enter task");

    try {
      await axios.post("/tasks", { title }, { headers });
      setTitle("");
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/tasks/${id}`, { headers });
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting task");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={styles.container}>
      
      <div style={styles.card}>
        
        {/* Header */}
        <div style={styles.header}>
          <h2>Dashboard</h2>
          <span style={{
            ...styles.roleBadge,
            background: role === "admin" ? "#ff4d4f" : "#1890ff"
          }}>
            {role}
          </span>
        </div>

        {/* Admin Banner */}
        {role === "admin" && (
          <p style={styles.adminText}>🔥 Admin Access Enabled</p>
        )}

        {/* Input Section */}
        <div style={styles.inputRow}>
          <input
            style={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task"
          />
          <button style={styles.addBtn} onClick={createTask}>
            Add
          </button>
        </div>

        {/* Task List */}
        <div style={styles.taskList}>
          {tasks.map((t) => (
            <div key={t._id} style={styles.taskItem}>
              <p>{t.title}</p>

              {role === "admin" && (
                <button
                  style={styles.deleteBtn}
                  onClick={() => deleteTask(t._id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f6fa"
  },
  card: {
    width: "400px",
    padding: "25px",
    borderRadius: "10px",
    background: "#fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px"
  },
  roleBadge: {
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    textTransform: "capitalize"
  },
  adminText: {
    color: "red",
    fontWeight: "bold",
    marginBottom: "10px"
  },
  inputRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px"
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  addBtn: {
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    background: "#52c41a",
    color: "#fff",
    cursor: "pointer"
  },
  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  taskItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    background: "#fafafa",
    borderRadius: "5px"
  },
  deleteBtn: {
    background: "#ff4d4f",
    border: "none",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer"
  }
};