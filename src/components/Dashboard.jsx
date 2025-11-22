import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    reports: 0,
    cleanups: 0,
  });
  const [users, setUsers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Fetch stats
  useEffect(() => {
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

    fetchStats();
  }, []);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("https://back-project-olive.vercel.app/admin/users");
        setUsers(res.data.users);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`https://back-project-olive.vercel.app/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id)); // remove deleted user from state
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
        <div className="card users-card">
          <h3>Users</h3>
          <p>{stats.users}</p>
        </div>
        <div className="card reports-card">
          <h3>Reports</h3>
          <p>{stats.reports}</p>
        </div>
        <div className="card cleanups-card">
          <h3>CleanUps</h3>
          <p>{stats.cleanups}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="mt-10 p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">All Users</h2>

        {loadingUsers ? (
          <p>Loading users...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-3 text-left">Full Name</th>
                  <th className="border p-3 text-left">Email</th>
                  <th className="border p-3 text-left">Role</th>
                  <th className="border p-3 text-left">Password (hashed)</th>
                  <th className="border p-3 text-left">Token</th>
                  <th className="border p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, index) => (
                  <tr key={u._id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="border p-2">{u.fullName}</td>
                    <td className="border p-2">{u.email}</td>
                    <td className="border p-2">{u.role}</td>
                    <td className="border p-2 text-xs break-all">{u.password}</td>
                    <td className="border p-2 text-xs break-all">{u.token}</td>
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => deleteUser(u._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
