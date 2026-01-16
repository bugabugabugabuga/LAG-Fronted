import { useEffect, useState } from "react";
import axios from "axios";
import "./Leaderboard.css";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(
          `${SERVER_URL}/competition/leaderboard`
        );
        setLeaderboard(res.data);
      } catch (err) {
        console.error("Failed to load leaderboard:", err);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-page">
      <h1>🏆 Leaderboard</h1>
      <p>Registered competition participants</p>

      {leaderboard.length === 0 ? (
        <p>No participants yet</p>
      ) : (
        <ul className="leaderboard-list">
          {leaderboard.map((entry, index) => (
            <li key={entry._id}>
              <span className="rank">#{index + 1}</span>
              <span className="name">
                {entry.user?.fullname || "Anonymous"}
              </span>
              <span className="likes">❤️ {entry.likes}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
