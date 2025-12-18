import { useState } from "react";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import "./Donate.css";

export default function Donate() {
  const location = useLocation();
  const reportId = location.state?.reportId; // get report ID
  const presetAmounts = [10, 20, 50];

  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePreset = (value) => {
    setAmount(value);
    setCustomAmount("");
  };

  const handleCustomChange = (e) => {
    setCustomAmount(e.target.value);
    setAmount("");
  };

  const handleDonate = async () => {
    const donationAmount = amount || customAmount;
    if (!donationAmount || donationAmount <= 0) return alert("Enter a valid amount.");
    if (!reportId) return alert("No report selected.");

    const cents = Math.round(Number(donationAmount) * 100);
    setLoading(true);

    try {
      const res = await fetch("https://back-project-olive.vercel.app/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({
          productName: `Donation for report ${reportId}`,
          amount: cents,
          description: "User donation",
          reportId,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Stripe response error:", data);
        alert("Failed to initiate payment.");
      }
    } catch (err) {
      console.error("Donate fetch error:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cntr" style={{ maxWidth: "400px", margin: "0 auto", padding: "2rem" }}>
      <h2 className="rame">Support CleanQuest</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
        {presetAmounts.map((amt) => (
          <button
            key={amt}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: amount === amt ? "#6772E5" : "#EEE",
              color: amount === amt ? "#FFF" : "#000",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => handlePreset(amt)}
          >
            ${amt}
          </button>
        ))}
      </div>

      <input
        type="number"
        placeholder="Custom amount"
        value={customAmount}
        onChange={handleCustomChange}
        style={{
          width: "100%",
          padding: "0.5rem",
          borderRadius: "5px",
          border: "1px solid #CCC",
          marginBottom: "1rem",
        }}
      />

      <button
        onClick={handleDonate}
        disabled={loading}
        style={{
          width: "100%",
          padding: "0.75rem",
          backgroundColor: "#6772E5",
          color: "#FFF",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "1rem",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Redirecting..." : `Donate $${amount || customAmount || 0}`}
      </button>
    </div>
  );
}
