import React, { useState } from "react";
import "./styling/contact-us.css";
import placeholderImg from "./assets/placeholder.jpg"; // Placeholder image path'

const teamMembers = [
   {
    id: 1,
    name: "Daniel Rawana",
    role: "Team Leader",
    blurb:"I’m Daniel and I’ve been the team lead for this project. I’ve learned so much through this amazing journey with an incredible team. Keep an eye out for more fun AI projects from me in the future!",
    img: "daniel.jpg",
  },
  {
    id: 2,
    name: "Francesco Combatti",
    role: "Backend, Database",
    blurb: "Hey! I'm Francesco, a Computer Science student passionate about Cybersecurity, AI, and solving real-world problems. On our team, I focused on data testing, backend logic, and secure code. I enjoy working out, learning new tools, watching shows, and reading.",
    img: "francesco.jpeg",
    email: "francombatti@hotmail.com"
  },
  {
    id: 3,
    name: "Eduardo Goncalvez",
    role: "AI/ML, Backend",
    blurb: "lorem ispum doloor sit amet. lorem ispum doloor sit amet.",
  },
  {
    id: 4,
    name: "Camila Gloria",
    role: "Frontend",
    blurb: "lorem ispum doloor sit amet. lorem ispum doloor sit amet.",
  },
  {
    id: 5,
    name: "Christopher Belizaire",
    role: "Frontend, Database",
    blurb: "Hey! I'm Chris, a Sophomore in CS at FIU. I have an interest in AI and Data Science, but I'm always open to learning new things. I've learned so much throughout this journey and I can't wait to see what opporutnities await me in the future!",
    img: "christopher.jpg",
    email: "chrisb.9085@gmail.com"
  },
  {
    id: 6,
    name: "Kevon Williams",
    role: "Backend",
    blurb: "lorem ispum doloor sit amet.",
  },
  {
    id: 7,
    name: "Miles Weatherspoon",
    role: "Project Support",
    blurb: "lorem ispum doloor sit amet.",
  },
  {
    id: 8,
    name: "Alec Borque",
    role: "AI/ML, Backend",
    blurb: "lorem ispum doloor sit amet.",
  },
  {
    id: 9,
    name: "Alessandra Uribe",
    role: "Fashion SME, Backend, Database",
    blurb: "lorem ispum doloor sit amet.",
  },
  {
    id: 10,
    name: "Laisha Bravo",
    role: "Frontend",
    blurb: "lorem ispum doloor sit amet.",
  },
  {
    id: 11,
    name: "Nathan Chen",
    role: "AI/ML, Backend",
    blurb: "lorem ispum doloor sit amet.",
  },
  {
    id: 12,
    name: "Abhiram Bhogi",
    role: "AI/ML, Backend",
    blurb: "lorem ispum doloor sit amet.",
  },
  {
    id: 13,
    name: "Tyler Coy",
    role: "AI/ML",
    blurb: "lorem ispum doloor sit amet.",
  },
  {
    id: 14,
    name: "Ruben Perez",
    role: "AI/ML",
    blurb: "lorem ispum doloor sit amet.",
  },
  {
    id: 15,
    name: "Jayden Krishna",
    role: "Frontend",
    blurb: "lorem ispum doloor sit amet.",
  },
];

const getHeadshot = (imgName) => {
if(!imgName){ return placeholderImg; } // Return placeholder image if imgName is not provided

  try{
    return require(`./assets/headshots/${imgName}`);
  }catch(err){
    return placeholderImg; // Return placeholder image if the image is not found
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
                <div className="member animate-pop">
                  <h2 id="member-info-text">{member.name}
                    <span className="role">[{member.role}]</span>
                  </h2>
                  <div className="blurb">
                    <img src={getHeadshot(member.img)} alt={member.name} />
                    <p id='blurb-text'>{member.blurb}</p>
                  </div>
                  <div className="email-section">
                    Email: {member.email ?
                      <a href={`mailto:${member.email}`}>{member.email}</a> : "N/A"}
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
      <div className="main-container">
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
