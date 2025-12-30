import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function Profile() {
  const { user, login } = useAuth();

  // 🔐 Protect route
  if (!user) {
    return <Navigate to="/login" />;
  }

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔐 Password states
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 🔄 Load profile
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await api.get("/users/me");
        setFullName(res.data.full_name);
        setEmail(res.data.email);
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  // ✏️ Update profile (full name only)
  const handleProfileUpdate = async () => {
    setError("");
    setMessage("");

    try {
      const res = await api.put("/users/me/profile", {
        full_name: fullName,
      });

      // ✅ Update auth context with returned user
      login(res.data);

      setMessage("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.detail || "Update failed");
    }
  };

  // 🔐 Change password
  const handlePasswordChange = async () => {
    setError("");
    setMessage("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await api.put("/users/me/change-password", {
        old_password: oldPassword,
        new_password: newPassword,
      });

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
      setMessage("Password updated successfully");
    } catch (err) {
      setError(err.response?.data?.detail || "Password update failed");
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading profile...</p>;
  }

  return (
    <div className="container">
      <h2>Profile</h2>

      {error && <p className="message-error">{error}</p>}
      {message && <p className="message-success">{message}</p>}

      <h3>Profile Info</h3>

      <label>Full Name</label>
      <input
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <label>Email</label>
      <input value={email} disabled />

      <button className="primary" onClick={handleProfileUpdate}>
        Save Profile
      </button>

      <hr />

      <button
        className="secondary"
        onClick={() => setShowPasswordForm(!showPasswordForm)}
      >
        {showPasswordForm ? "Cancel Password Change" : "Change Password"}
      </button>

      {showPasswordForm && (
        <>
          <h3 style={{ marginTop: "20px" }}>Change Password</h3>

          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button className="primary" onClick={handlePasswordChange}>
            Update Password
          </button>
        </>
      )}
    </div>
  );
}
