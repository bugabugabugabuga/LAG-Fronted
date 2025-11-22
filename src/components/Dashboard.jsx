import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, reports: 0, cleanups: 0 });
  const [users, setUsers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Fetch stats
  const fetchStats = async () => {
    try {
      const res = await axios.get("https://back-project-olive.vercel.app/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch users and remove duplicates
  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://back-project-olive.vercel.app/admin/users");

      // Remove duplicates by _id
      const uniqueUsers = Array.from(
        new Map(res.data.users.map(u => [u._id, u])).values()
      );

      setUsers(uniqueUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`https://back-project-olive.vercel.app/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setStats((prev) => ({ ...prev, users: prev.users - 1 }));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loadingStats) return <p className="loading">Loading stats...</p>;

  return (
    <div className="dashboard-page">
      <h2>Dashboard Overview</h2>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="card">
          <h3>Users</h3>
          <p>{stats.users}</p>
        </div>
        <div className="card">
          <h3>Reports</h3>
          <p>{stats.reports}</p>
        </div>
        <div className="card">
          <h3>CleanUps</h3>
          <p>{stats.cleanups}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <h2>All Users</h2>
        {loadingUsers ? (
          <p>Loading users...</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Hashed Password</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr key={u._id} className={index % 2 === 0 ? "even" : "odd"}>
                  <td className="small-text">{u._id}</td>
                  <td>{u.fullname || u.fullName || "—"}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td className="small-text">{u.password || "—"}</td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteUser(u._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
