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
    Authorization: token
  };

  // 📥 Get Tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get("/tasks", { headers });
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ➕ Create Task
  const createTask = async () => {
    try {
      await axios.post("/tasks", { title }, { headers });
      setTitle("");
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // ❌ Delete Task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`/tasks/${id}`, { headers });
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // 🚀 Load tasks on start
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h2>Dashboard ({role})</h2>

      {/* 🔥 ADMIN UI */}
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

          {/* 👉 Only admin delete (optional) */}
          {role === "admin" && (
            <button onClick={() => deleteTask(t._id)}>Delete</button>
          )}
        </div>
      ))}
    </div>
  );
}