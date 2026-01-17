import { useEffect, useState } from "react";
import axios from "axios";
import "./Leaderboard.css";

const API_URL = import.meta.env.VITE_SERVER_URL;

export default function Leaderboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/competition/leaderboard`).then((res) => {
      setData(res.data);
    });
  }, []);

  return (
    <div className="leaderboard-page">
      <h1>🏆 Leaderboard</h1>

      {data.length === 0 ? (
        <p>No participants yet</p>
      ) : (
        <ul className="leaderboard-list">
  {data.map((entry, i) => (
    <li key={entry._id} className={`leaderboard-item rank-${i + 1}`}>
      <span className="rank">#{i + 1}</span>
      <span className="name">{entry.user?.fullname || "Unknown"}</span>
      <span className="likes">❤️ {entry.likes}</span>
    </li>
  ))}
</ul>


      )}
    </div>
  );
}
