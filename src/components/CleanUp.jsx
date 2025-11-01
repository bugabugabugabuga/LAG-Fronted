import React, { useState } from "react";
import "./CleanUp.css";

const cleanupSpots = [
  {
    id: 1,
    title: "5th Avenue Bus Stop",
    priority: "high",
    date: "1/20/2025",
    description: "Cigarette butts and fast food wrappers scattered around bus stop. High foot traffic area that needs immediate attention.",
  },
  {
    id: 2,
    title: "Riverside Community Park",
    priority: "high",
    date: "1/22/2025",
    description: "Construction debris and plastic bags dumped in neighborhood park. Playground area affected, children's safety at risk.",
  },
  {
    id: 3,
    title: "Mountain Trail, Mile Marker 3",
    priority: "medium",
    date: "1/21/2025",
    description: "Plastic bottles and cans along hiking trail. Moderate amount, accessible by foot.",
  },  
];

function CleanUp() {
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [afterPhoto, setAfterPhoto] = useState(null);

  const openModal = (spot) => {
    setSelectedSpot(spot);
  };

  const closeModal = () => {
    setSelectedSpot(null);
    setAfterPhoto(null);
  };

  const handlePhotoChange = (e) => {
    setAfterPhoto(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="cleanup-container">
      <h2>Volunteer for Cleanup</h2>
      <p>Join the community effort! Choose a reported trash spot, clean it up, and share your results. Every action makes a difference.</p>

      <h3>Available for Cleanup</h3>
      <p>{cleanupSpots.length} spots need help</p>

      <div className="cards-container">
        {cleanupSpots.map((spot) => (
          <div key={spot.id} className="cleanup-card" onClick={() => openModal(spot)}>
            <h4>{spot.title}</h4>
            <span className={`priority ${spot.priority}`}>{spot.priority} priority</span>
            <p>{spot.date}</p>
            <p>{spot.description}</p>
          </div>
        ))}
      </div>

      <h3>Make an Impact</h3>
      <div className="stats">
        <div><strong>247</strong> Spots Cleaned</div>
        <div><strong>89</strong> Active Volunteers</div>
        <div><strong>12.4k</strong> Pounds Removed</div>
      </div>

      {selectedSpot && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedSpot.title}</h3>
            <p>{selectedSpot.description}</p>
            <label className="file-upload">
              Upload After Photo
              <input type="file" onChange={handlePhotoChange} />
            </label>
            {afterPhoto && <img src={afterPhoto} alt="After Cleanup" className="after-photo" />}
            <button onClick={closeModal} className="close-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CleanUp;
