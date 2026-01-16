export function addLikeToUser(userName) {
  const leaderboard =
    JSON.parse(localStorage.getItem("leaderboard")) || [];

  const updated = leaderboard.map((entry) => {
    if (entry.name === userName) {
      return {
        ...entry,
        likes: entry.likes + 1, // ✅ add like
      };
    }
    return entry;
  });

  localStorage.setItem("leaderboard", JSON.stringify(updated));
}
