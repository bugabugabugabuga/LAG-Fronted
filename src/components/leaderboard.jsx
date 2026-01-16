import { useEffect, useState } from "react";
import "./Leaderboard.css";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const storedLeaderboard =
  JSON.parse(localStorage.getItem("leaderboard")) || [];

storedLeaderboard.sort((a, b) => b.likes - a.likes); // ✅ DESC

setLeaderboard(storedLeaderboard);

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
           <li key={index}>
  <span className="rank">#{index + 1}</span>
  <span className="name">{entry.name}</span>
  <span className="likes">❤️ {entry.likes}</span>
</li>

          ))}
        </ul>
      )}
    </div>
  );
}
