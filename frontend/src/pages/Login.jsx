import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.access_token);
      navigate("/");
    } catch (err) {
      alert("Login failed");
    }
  };

return (
  <div className="dashboard-root">
    <div className="dashboard-shell">

      {/* LEFT PANEL — Login form */}
      <div className="panel-left">
        <div className="panel-left-inner">

          <h1 className="panel-title">Sign In</h1>
          <p className="panel-subtitle">Access your task board</p>

          <form onSubmit={handleSubmit} className="input-group">
            <input
              className="task-input"
              placeholder="Email address"
              type="email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className="task-input"
              placeholder="Password"
              type="password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button type="submit" className="add-btn">
              Sign In
            </button>
          </form>

          <p className="login-footer">
            Don't have an account? <a href="/register" className="login-link">Create one</a>
          </p>

        </div>
      </div>

      {/* RIGHT PANEL — Brand */}
      <div className="panel-right">
        <div className="panel-right-inner">
          <div className="brand-icon">✦</div>
          <h2 className="brand-title">Welcome back!</h2>
          <p className="brand-body">
            Great to have you here. Pick up right where you left off and make today productive.
          </p>
          <div className="brand-divider" />
          <p className="brand-tagline">Your tasks are waiting.</p>
        </div>
      </div>

    </div>
  </div>
);
}
