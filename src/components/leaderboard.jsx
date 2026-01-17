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
        <ul>
  {data.map((entry, i) => (
    <li key={entry._id}>
      #{i + 1}{" "}
      {entry.user?.fullname || "Unknown"} — ❤️ {entry.likes}
    </li>
  ))}
       </ul>

      )}
    </div>
  );
}
