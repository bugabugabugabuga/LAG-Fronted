import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    reports: 0,
    cleanups: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:3000/dashboard/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="loading">Loading stats...</p>;

  return (
    <div className="dashboard-page">
      <h2>Dashboard Overview</h2>
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
    </div>
  );
};

export default Dashboard;
