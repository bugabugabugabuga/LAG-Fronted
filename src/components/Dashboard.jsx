import React, { useEffect, useState, useContext } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import "./Dashboard.css";
import { UserContext } from "../context/user-provider";

export default function Dashboard() {
  const { user, setUser } = useContext(UserContext); // <-- added
  const [stats, setStats] = useState({ users: 0, reports: 0, cleanups: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const token = Cookies.get("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // --- Fetch current user for context (fix header dropdown on refresh)
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (user) return; // already set
      if (!token) return;

      try {
        const res = await axios.get("https://back-project-olive.vercel.app/auth/current-user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    };
    fetchCurrentUser();
  }, [token]);

  // --- Fetch stats
  const fetchStats = async () => {
    try {
      const res = await fetch("https://back-project-olive.vercel.app/dashboard/stats", { headers });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch("https://back-project-olive.vercel.app/api/users", { headers });
      const data = await res.json();
      setUsers(data.users || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`https://back-project-olive.vercel.app/api/users/${id}`, {
        method: "DELETE",
        headers,
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const updateUser = async () => {
    try {
      await fetch(`https://back-project-olive.vercel.app/api/users/${selectedUser._id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          fullname: selectedUser.fullname,
          email: selectedUser.email,
          role: selectedUser.role,
        }),
      });
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>

      <div className="stats-cards">
        <div className="card">
          <h3>Total Users</h3>
          <p>{stats.users}</p>
        </div>
        <div className="card">
          <h3>Total Reports</h3>
          <p>{stats.reports}</p>
        </div>
        <div className="card">
          <h3>Total Cleanups</h3>
          <p>{stats.cleanups}</p>
        </div>
      </div>

      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>Fullname</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.fullname}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button
                  onClick={() => {
                    setSelectedUser(u);
                    setModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => deleteUser(u._id)} className="delete-btn">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Update User</h3>
            <label>Fullname</label>
            <input
              type="text"
              value={selectedUser.fullname}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, fullname: e.target.value })
              }
            />
            <label>Email</label>
            <input
              type="email"
              value={selectedUser.email}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
            />
            <label>Role</label>
            <select
              value={selectedUser.role}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, role: e.target.value })
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <div className="modal-buttons">
              <button onClick={updateUser}>Save</button>
              <button onClick={() => setModalOpen(false)} className="delete-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
