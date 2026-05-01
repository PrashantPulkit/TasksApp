import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch {
      alert("Register failed");
    }
  };

  return (
  <div className="dashboard-root">
    <div className="dashboard-shell">

      {/* LEFT PANEL — Brand */}
      <div className="panel-right">
        <div className="panel-right-inner">
          <div className="brand-icon">✦</div>
          <h2 className="brand-title">Join us today.</h2>
          <p className="brand-body">
            Create your account and start organizing your work. Simple, fast, and always in sync.
          </p>
          <div className="brand-divider" />
          <p className="brand-tagline">Your productivity starts here.</p>
        </div>
      </div>

      {/* RIGHT PANEL — Register form */}
      <div className="panel-left">
        <div className="panel-left-inner">

          <h1 className="panel-title">Create Account</h1>
          <p className="panel-subtitle">Get started for free</p>

          <form onSubmit={handleSubmit} className="input-group">
            <input
              className="task-input"
              placeholder="Username"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
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
              Create Account
            </button>
          </form>

          <p className="login-footer">
            Already have an account? <a href="/login" className="login-link">Sign in</a>
          </p>

        </div>
      </div>

    </div>
  </div>
);
}
