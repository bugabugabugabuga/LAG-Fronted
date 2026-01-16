import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Competition.css";
import { useContext } from "react";
import { UserContext } from "../context/user-provider.jsx";
import Cookies from "js-cookie";
Cookies.set("competitionToken", "joined", { expires: 7 });


const Competition = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

const handleEnterCompetition = () => {
  setLoading(true);

  // ✅ STORE TOKEN IN COOKIE (THIS IS THE LINE YOU ASKED ABOUT)
  Cookies.set("competitionToken", "joined", {
    expires: 7,
    path: "/",
  });

  // ✅ SAVE USER TO LEADERBOARD (name only)
  const fullname =
    user?.fullname ||
    user?.username ||
    user?.email ||
    "Anonymous";

  const existingLeaderboard =
    JSON.parse(localStorage.getItem("leaderboard")) || [];

  const alreadyExists = existingLeaderboard.some(
    (entry) => entry.name === fullname
  );

  if (!alreadyExists) {
existingLeaderboard.push({
  name: fullname,
  likes: 0, // ✅ start with 0 likes
});

    localStorage.setItem(
      "leaderboard",
      JSON.stringify(existingLeaderboard)
    );
  }

  // ✅ GO TO LEADERBOARD
  navigate("/Leaderboard");
};



console.log("USER OBJECT:", user);


  return (
    <div className="competition-page">
      <h1>🏆 Community Competition</h1>

      <div className="competition-card">
        <p>
          Entry Fee: <strong>FREE.</strong>
        </p>

        <button
          className="enter-btn"
          onClick={handleEnterCompetition}
          disabled={loading}
        >
          {loading ? "Joining..." : "Enter Competition!"}
        </button>
      </div>
    </div>
  );
};

export default Competition;
