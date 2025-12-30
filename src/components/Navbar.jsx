import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ padding: "10px", background: "#eee" }}>
      <span>{user.email} ({user.role})</span>{" "}
      <Link to="/profile">Profile</Link>{" "}
      {user.role === "admin" && <Link to="/admin">Admin</Link>}{" "}
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}
