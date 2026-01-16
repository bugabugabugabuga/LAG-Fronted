import "./leaderboard.css";

const Leaderboard = () => {
  // temporary static data (later you can fetch from backend)
  const leaderboardData = [
    { rank: 1, name: "Alice", points: 120 },
    { rank: 2, name: "Bob", points: 95 },
    { rank: 3, name: "Charlie", points: 80 },
    { rank: 4, name: "David", points: 65 },
    { rank: 5, name: "Eva", points: 50 },
  ];

  return (
    <div className="leaderboard-page" style={{ padding: "2rem" }}>
      <h1>🏆 Leaderboard</h1>
      <p>Top volunteers in the CleanQuest competition</p>

      <table
        style={{
          width: "100%",
          maxWidth: "500px",
          marginTop: "1rem",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
              Rank
            </th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
              Name
            </th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
              Points
            </th>
          </tr>
        </thead>

        <tbody>
          {leaderboardData.map((user) => (
            <tr key={user.rank}>
              <td>{user.rank}</td>
              <td>{user.name}</td>
              <td>{user.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Lboard;
