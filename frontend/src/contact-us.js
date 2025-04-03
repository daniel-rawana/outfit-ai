import React, { useState } from "react";
import "./styling/contact-us.css";
import Navbar from "./navbar"; // Ensure Navbar is imported correctly
import placeholderImg from "./assets/placeholder.jpg"; // Placeholder image path

const teamMembers = [
   {
    id: 1,
    name: "Daniel Rawana",
    role: "Team Leader",
    blurb:
      "lorem ispum doloor sit amet. lorem ispum doloor sit amet. lorem ispum doloor sit amet.",
    img: placeholderImg,
  },
  {
    id: 2,
    name: "Member 2",
    role: "Role",
    blurb: "lorem ispum doloor sit amet. lorem ispum doloor sit amet.",
    img: placeholderImg,
  },
  {
    id: 3,
    name: "Member 3",
    role: "Role",
    blurb: "lorem ispum doloor sit amet. lorem ispum doloor sit amet.",
    img: placeholderImg,
  },
  {
    id: 4,
    name: "Member 4",
    role: "Role",
    blurb: "lorem ispum doloor sit amet. lorem ispum doloor sit amet.",
    img: placeholderImg,
  },
  {
    id: 5,
    name: "Member 5",
    role: "Role",
    blurb: "lorem ispum doloor sit amet.",
    img: placeholderImg,
  },
  {
    id: 6,
    name: "Member 6",
    role: "Role",
    blurb: "lorem ispum doloor sit amet.",
    img: placeholderImg,
  },
  {
    id: 7,
    name: "Member 7",
    role: "Role",
    blurb: "lorem ispum doloor sit amet.",
    img: placeholderImg,
  },
  {
    id: 8,
    name: "Member 8",
    role: "Role",
    blurb: "lorem ispum doloor sit amet.",
    img: placeholderImg,
  },
  {
    id: 9,
    name: "Member 9",
    role: "Role",
    blurb: "lorem ispum doloor sit amet.",
    img: placeholderImg,
  },
  {
    id: 10,
    name: "Member 10",
    role: "Role",
    blurb: "lorem ispum doloor sit amet.",
    img: placeholderImg,
  },
  {
    id: 11,
    name: "Member 11",
    role: "Role",
    blurb: "lorem ispum doloor sit amet.",
    img: placeholderImg,
  },
  {
    id: 12,
    name: "Member 12",
    role: "Role",
    blurb: "lorem ispum doloor sit amet.",
    img: placeholderImg,
  },
  {
    id: 13,
    name: "Member 13",
    role: "Role",
    blurb: "lorem ispum doloor sit amet.",
    img: placeholderImg,
  },
  {
    id: 14,
    name: "Member 14",
    role: "Role",
    blurb: "lorem ispum doloor sit amet.",
    img: placeholderImg,
  },
  {
    id: 15,
    name: "Member 15",
    role: "Role",
    blurb: "lorem ispum doloor sit amet.",
    img: placeholderImg,
  },
];

const TeamSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerPage = 4;

  const handleNext = () => {
    if (currentIndex + cardsPerPage < teamMembers.length) {
      setCurrentIndex(currentIndex + cardsPerPage);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - cardsPerPage);
    }
  };

  const getCurrentCards = () => {
    return teamMembers.slice(currentIndex, currentIndex + cardsPerPage);
  };

  const renderCardRows = () => {
    const currentCards = getCurrentCards();
    const rows = [];

    for (let i = 0; i < currentCards.length; i += 2) {
      rows.push(
        <tr key={i}>
          {[currentCards[i], currentCards[i + 1]]
            .filter(Boolean)
            .map((member) => (
              <td key={member.id}>
                <div className="member">
                  <h2 id="member-info-text">{member.name}, {member.role}</h2>
                  <div className="blurb">
                    <img src={member.img} alt={member.name} />
                    <p id='blurb-text'>{member.blurb}</p>
                  </div>
                </div>
              </td>
            ))}
        </tr>
      );
    }

    return rows;
  };

  return (
    <div>
      <div className="main-content">
        <div className="header-container">
          <h1 className="header">Meet the Team</h1>
          <p className="subheader">Here at RunwAI, we are a team of passionate individuals dedicated to revolutionizing the fashion and AI industry.</p>
        </div>
        <div className="team-members">
          <table>{renderCardRows()}</table>
          <div className="btn-div" style={{ textAlign: "center", marginTop: "20px" }}>
            <button className="prev-btn" onClick={handlePrev} disabled={currentIndex === 0}>←</button>
            <button
              className="next-btn"
              onClick={handleNext}
              disabled={currentIndex + cardsPerPage >= teamMembers.length}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSlider;
