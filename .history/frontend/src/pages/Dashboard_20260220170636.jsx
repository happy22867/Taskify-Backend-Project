import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: ""
  });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const headers = {
    Authorization: `Bearer ${token}`
  };

  // Protect Route
  useEffect(() => {
    if (!token) {
      window.location = "/";
    }
  }, []);

  // Fetch Tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get("/tasks", { headers });
      setTasks(res.data);
    } catch (err) {
      alert("Error fetching tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Open Add Form
  const openAddForm = () => {
    setForm({ title: "", description: "" });
    setEditId(null);
    setShowForm(true);
  };

  // Open Edit Form
  const openEditForm = (task) => {
    setForm({
      title: task.title,
      description: task.description
    });
    setEditId(task._id);
    setShowForm(true);
  };

  // Save (Add / Update)
  const handleSubmit = async () => {
    if (!form.title || !form.description) {
      return alert("Fill all fields");
    }

    try {
      if (editId) {
        // UPDATE
        await axios.put(`/tasks/${editId}`, form, { headers });
      } else {
        // CREATE
        await axios.post("/tasks", form, { headers });
      }

      setShowForm(false);
      fetchTasks();
    } catch (err) {
      alert("Something went wrong");
    }
  };

  // ❌ Delete
  const deleteTask = async (id) => {
    try {
      await axios.delete(`/tasks/${id}`, { headers });
      fetchTasks();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <h2>Dashboard</h2>
          <span>{role}</span>
        </div>

        {/* Admin Note */}
        {role === "admin" && (
          <p style={{ color: "red" }}>Admin Access Enabled 🔥</p>
        )}

        {/* Add Button */}
        <button style={styles.addBtn} onClick={openAddForm}>
          + Add Task
        </button>

        {/* Task List */}
        {tasks.map((task) => (
          <div key={task._id} style={styles.task}>
            <div>
              <h4>{task.title}</h4>
              <p>{task.description}</p>
            </div>

            <div style={{ display: "flex", gap: "5px" }}>
              <button onClick={() => openEditForm(task)}>
                Update
              </button>

              {role === "admin" && (
                <button onClick={() => deleteTask(task._id)}>
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}

      </div>

      {/* Popup Form */}
      {showForm && (
        <div style={styles.modal}>
          <div style={styles.modalBox}>
            <h3>{editId ? "Update Task" : "Add Task"}</h3>

            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />

            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <button onClick={handleSubmit}>
              {editId ? "Update" : "Add"}
            </button>

            <button onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "40px",
    background: "#f4f4f4",
    minHeight: "100vh"
  },
  card: {
    width: "500px",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px"
  },
  header: {
    display: "flex",
    justifyContent: "space-between"
  },
  addBtn: {
    margin: "10px 0",
    padding: "8px",
    background: "green",
    color: "#fff",
    border: "none"
  },
  task: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    borderBottom: "1px solid #ddd"
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  modalBox: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "300px"
  }
};