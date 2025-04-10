import React, { useState } from "react";
import "./styling/contact-us.css";
import placeholderImg from "./assets/placeholder.jpg"; // Placeholder image path'

const teamMembers = [
   {
    id: 1,
    name: "Daniel Rawana",
    role: "Team Leader",
    blurb:
      "lorem ispum doloor sit amet. lorem ispum doloor sit amet. lorem ispum doloor sit amet.",
    img: "daniel.jpg",
    email: "",
  },
  {
    id: 2,
    name: "Francesco Combatti",
    role: "Backend, Database",
    blurb: "Hey! I'm Francesco, a Computer Science student passionate about Cybersecurity, AI, and solving real-world problems. On our team, I focused on data testing, backend logic, and secure code. I enjoy working out, learning new tools, watching shows, and reading.",
    img: "francesco.jpg",
    email: "francombatti@hotmail.com"
  },
  {
    id: 3,
    name: "Eduardo Goncalvez",
    role: "AI/ML, Backend",
    blurb: "lorem ispum doloor sit amet. lorem ispum doloor sit amet.",
    img: placeholderImg,
  },
  {
    id: 4,
    name: "Camila Gloria",
    role: "Frontend",
    blurb: "lorem ispum doloor sit amet. lorem ispum doloor sit amet.",
    img: placeholderImg,
  },
  {
    id: 5,
    name: "Christopher Belizaire",
    role: "Frontend, Database",
    blurb: "lorem ispum doloor sit amet.",
    img: placeholderImg,
  },
  {
    id: 6,
    name: "Kevon Williams",
    role: "Backend",
    blurb: "lorem ispum doloor sit amet.",
    img: placeholderImg,
  },
  {
    id: 7,
    name: "Miles Weatherspoon",
    role: "Project Support",
    blurb: "lorem ispum doloor sit amet.",
    img: placeholderImg,
  },
  {
    id: 8,
    name: "Alec Borque",
    role: "AI/ML, Backend",
    blurb: "lorem ispum doloor sit amet.",
    img: placeholderImg,
  },
  {
    id: 9,
    name: "Alessandra Uribe",
    role: "Fashion SME, Backend, Database",
    blurb: "lorem ispum doloor sit amet.",
    img: placeholderImg,
  },
  {
    id: 10,
    name: "Laisha Brez",
    role: "Frontend",
    blurb: "lorem ispum doloor sit amet.",
    img: placeholderImg,
  },
  {
    id: 11,
    name: "Nathan Chen",
    role: "AI/ML, Backend",
    blurb: "lorem ispum doloor sit amet.",
    img: placeholderImg,
  },
  {
    id: 12,
    name: "Abhiram Bhogi",
    role: "AI/ML, Backend",
    blurb: "lorem ispum doloor sit amet.",
    img: placeholderImg,
  },
  {
    id: 13,
    name: "Tyler Coy",
    role: "AI/ML",
    blurb: "lorem ispum doloor sit amet.",
    img: placeholderImg,
  },
  {
    id: 14,
    name: "Ruben Perez",
    role: "AI/ML",
    blurb: "lorem ispum doloor sit amet.",
    img: placeholderImg,
  },
  {
    id: 15,
    name: "Jayden Krishna",
    role: "Frontend",
    blurb: "lorem ispum doloor sit amet.",
    img: placeholderImg,
  },
];

const getHeadshot = (imgName) => {
  try{
    return require(`./assets/${imgName}.jpg`);
  }catch(err){
    return placeholderImg;
  }

}

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
                    <img src={getHeadshot(member.img)} alt={member.name} />
                    <p id='blurb-text'>{member.blurb}</p>
                  </div>
                  <div className="email-section">
                    Email: {member.email || "N/A"}
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
