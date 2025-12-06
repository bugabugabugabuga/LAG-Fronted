import { useState } from "react";
import Cookies from "js-cookie";

export default function Donate() {
  const presetAmounts = [10, 20, 50];
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");

  const handlePreset = (value) => {
    setAmount(value);
    setCustomAmount(""); // reset custom input
  };

  const handleCustomChange = (e) => {
    setCustomAmount(e.target.value);
    setAmount(""); // reset preset selection
  };

  const handleDonate = async () => {
    const donationAmount = amount || customAmount;
    if (!donationAmount || donationAmount <= 0) return alert("Enter a valid amount.");

    const cents = Math.round(Number(donationAmount) * 100);

    try {
      const res = await fetch("https://localhost:3000/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({
          productName: "Donation",
          amount: cents,
          description: "User donation",
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // redirect to Stripe Checkout
      } else {
        console.error(data);
        alert("Failed to initiate payment.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "2rem" }}>
      <h2>Support CleanQuest</h2>

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

      <div style={{ marginBottom: "1rem" }}>
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
          }}
        />
      </div>

      <button
        onClick={handleDonate}
        style={{
          width: "100%",
          padding: "0.75rem",
          backgroundColor: "#6772E5",
          color: "#FFF",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "1rem",
        }}
      >
        Donate ${amount || customAmount || 0}
      </button>
    </div>
  );
}
