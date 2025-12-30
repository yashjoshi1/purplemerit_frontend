import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminDashboard() {
  const { user } = useAuth();

  // 🔐 Admin protection
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" />;
  }

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/users?page=${page}&limit=10`);
      setUsers(res.data.users);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const toggleUserStatus = async (id, isActive) => {
    const confirm = window.confirm(
      `Are you sure you want to ${isActive ? "deactivate" : "activate"} this user?`
    );
    if (!confirm) return;

    try {
      if (isActive) {
        await api.put(`/users/${id}/deactivate`);
      } else {
        await api.put(`/users/${id}/activate`);
      }
      fetchUsers();
    } catch {
      alert("Action failed");
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto" }}>
      <h2>Admin Dashboard</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading users...</p>}

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Email</th>
            <th>Full Name</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.userId}>
              <td>{u.email}</td>
              <td>{u.full_name}</td>
              <td>{u.role}</td>
              <td>{u.is_active ? "Active" : "Inactive"}</td>
              <td>
                <button
                  onClick={() => toggleUserStatus(u.userId, u.is_active)}
                  style={{
                    background: u.is_active ? "#ff4d4f" : "#52c41a",
                    color: "#fff",
                    border: "none",
                    padding: "5px 10px",
                  }}
                >
                  {u.is_active ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span style={{ margin: "0 10px" }}>Page {page}</span>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
