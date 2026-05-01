import { useEffect, useState } from "react";
import API from "../api";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTasks = async () => {
    const res = await API.get("/tasks/");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async () => {
    await API.post("/tasks/", { title });
    setTitle("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

return (
  <div className="app-root">

    {/* SIDEBAR */}
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-icon">✦</span>
        <span className="sidebar-brand-name">Taskflow</span>
      </div>



      <div className="sidebar-footer">
        <div className="sidebar-stat-row">
          <span className="sidebar-stat-label">Active tasks</span>
          <span className="sidebar-stat-value">{tasks.length}</span>
        </div>
        <div className="sidebar-progress-bar">
          <div
            className="sidebar-progress-fill"
            style={{ width: tasks.length > 0 ? `${Math.min(tasks.length * 10, 100)}%` : "0%" }}
          />
        </div>
      </div>
    </aside>

    {/* MAIN CONTENT */}
    <main className="main-content">

      {/* Top bar */}
      <div className="main-topbar">
        <div>
          <h1 className="main-title">My Tasks</h1>
          <p className="main-subtitle">Stay on top of your day</p>
        </div>
        <div className="topbar-actions">
          <span className="topbar-date">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </span>
        </div>
      </div>

      {/* Add task input */}
      <div className="add-task-bar">
        <div className="add-task-plus">+</div>
        <input
          className="add-task-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createTask()}
          placeholder="Add a task, press Enter to save..."
        />
        <button onClick={createTask} className="add-task-btn">Add</button>
      </div>

      {/* Task section */}
      <div className="task-section">
        <div className="task-section-header">
          <span className="task-section-title">All Tasks</span>
          <span className="task-section-count">{tasks.length}</span>
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-illustration">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="36" fill="#e8f7f0" />
                <path d="M26 40l10 10 18-20" stroke="#2eaa72" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="empty-title">All clear!</p>
            <p className="empty-sub">Add a task above to get started.</p>
          </div>
        ) : (
          <ul className="task-list">
            {tasks.map((t) => (
              <li key={t.id} className="task-row">
                <button className="task-circle" aria-label="Complete task" onClick={() => deleteTask(t.id)}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="task-circle-check">
                    <path d="M1.5 5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <span className="task-row-title">{t.title}</span>
                <div className="task-row-actions">
                  <button
                    className="task-delete-btn"
                    onClick={() => deleteTask(t.id)}
                    aria-label="Delete"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

    </main>
  </div>
);
}
