import { useEffect, useState } from "react";
import axios from "../api/axios";


export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const headers = {
    Authorization: token
  };

  const fetchTasks = async () => {
    const res = await axios.get("/tasks", { headers });
    setTasks(res.data);
  };

  const createTask = async () => {
    await axios.post("/tasks", { title }, { headers });
    setTitle("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`/tasks/${id}`, { headers });
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h2>Dashboard ({role})</h2>

      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button onClick={createTask}>Add Task</button>

      {tasks.map((t) => (
        <div key={t._id}>
          <p>{t.title}</p>
          <button onClick={() => deleteTask(t._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}