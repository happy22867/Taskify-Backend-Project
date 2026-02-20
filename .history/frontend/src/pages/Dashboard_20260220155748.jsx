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

  // ✅ FIX HERE
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
    if (!title) return alert("Enter task"); // ✅ small improvement

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
    <div>
      <h2>Dashboard ({role})</h2>

      {role === "admin" && <p>Admin Access Enabled 🔥</p>}

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task"
      />
      <button onClick={createTask}>Add Task</button>

      {tasks.map((t) => (
        <div key={t._id}>
          <p>{t.title}</p>

          {role === "admin" && (
            <button onClick={() => deleteTask(t._id)}>Delete</button>
          )}
        </div>
      ))}
    </div>
  );
}