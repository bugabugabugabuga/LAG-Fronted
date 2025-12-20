import React, { useEffect, useState, useContext } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import "./Dashboard.css";
import { UserContext } from "../context/user-provider";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://back-project-olive.vercel.app";

export default function Dashboard() {
  const { user, setUser } = useContext(UserContext);

  const [stats, setStats] = useState({ users: 0, reports: 0, cleanups: 0 });
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const token = Cookies.get("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // ---------------------------
  // Fetch current user
  // ---------------------------
  useEffect(() => {
    if (!token || user) return;

    axios
      .get(`${API_BASE}/auth/current-user`, { headers })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Auth error:", err));
  }, [token]);

  // ---------------------------
  // Fetch stats
  // ---------------------------
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/dashboard/stats`, { headers });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  // ---------------------------
  // Fetch users
  // ---------------------------
// Users
const fetchUsers = async () => {
  try {
    const res = await fetch(`${API_BASE}/admin/users`, { headers }); // fixed endpoint
    const data = await res.json();
    setUsers(data.users || []);
  } catch (err) {
    console.error("Failed to fetch users:", err);
  }
};

// Payments
const fetchPayments = async () => {
  try {
    const res = await fetch(`${API_BASE}/admin/payments`, { headers }); // keep as /admin/payments
    const data = await res.json();
    setPayments(data);
  } catch (err) {
    console.error("Failed to fetch payments:", err);
  }
};


  // ---------------------------
  // Initial load
  // ---------------------------
  useEffect(() => {
    Promise.all([fetchStats(), fetchUsers(), fetchPayments()])
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ---------------------------
  // Delete user
  // ---------------------------
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await fetch(`${API_BASE}/api/users/${id}`, {
        method: "DELETE",
        headers,
      });
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  // ---------------------------
  // Update user
  // ---------------------------
  const updateUser = async () => {
    try {
      await fetch(`${API_BASE}/api/users/${selectedUser._id}`, {
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
      console.error("Failed to update user:", err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>

      {/* STATS */}
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

      {/* USERS */}
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
                <button
                  onClick={() => deleteUser(u._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAYMENTS */}
      <h2>Payments / Donations</h2>
      <table>
        <thead>
          <tr>
            <th>Donor</th>
            <th>Donor Email</th>
            <th>Report Owner</th>
            <th>Report Title</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
  {payments.length ? (
    payments.map((p) => {
      const donorName = p.user?.fullname || "No donor";
      const donorEmail = p.user?.email || "N/A";

const reportOwner = p.report?.user?.fullname || "No owner";
const reportTitle = p.report?.title || "No title";


      return (
        <tr key={p._id}>
          <td>{donorName}</td>
          <td>{donorEmail}</td>
          <td>{reportOwner}</td>
          <td>{reportTitle}</td>
          <td>${(p.amount / 100).toFixed(2)}</td>
          <td>{p.status}</td>
          <td>{new Date(p.createdAt).toLocaleString()}</td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="7">No payments found</td>
    </tr>
  )}
</tbody>



      </table>

      {/* MODAL */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Update User</h3>

            <label>Fullname</label>
            <input
              value={selectedUser.fullname}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, fullname: e.target.value })
              }
            />

            <label>Email</label>
            <input
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
              <button
                className="delete-btn"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
