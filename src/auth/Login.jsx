import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    // 1️⃣ Login → get token
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    const token = res.data.access_token;

    if (!token) {
      throw new Error("No token returned from backend");
    }

    // 2️⃣ Save token FIRST
    localStorage.setItem("token", token);

    // 3️⃣ Fetch authenticated user
    const me = await api.get("/users/me");

    // 4️⃣ Save user to context
    login(me.data);

    // 5️⃣ Redirect
    navigate("/profile");
  } catch (err) {
    console.error("LOGIN ERROR:", err.response || err);
    setError(err.response?.data?.detail || "Invalid credentials");
  } finally {
    setLoading(false);
  }
};



  return (
  <div className="container">
    <h2>Login</h2>

    {error && <p className="message-error">{error}</p>}

    <form onSubmit={handleSubmit}>
      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="primary" type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>

    <p>
      Don’t have an account? <Link to="/signup">Signup</Link>
    </p>
  </div>
);
}
