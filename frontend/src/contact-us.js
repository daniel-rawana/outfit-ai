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
    blurb: "Hey! I'm Francesco, a Computer Science student passionate about Cybersecurity, AI, and solving real-world problems through tech. As part of our team, I focused on data testing, backend logic, and security, ensuring clean, efficient code and safe data handling. I enjoy working out, learning new tools, watch series and movies, reading, and a lot more. I'm always driven to grow, create meaningful impact, and turn challenges into opportunities.",
    img: "francesco.jpeg",
    email: "francombatti@hotmail.com"
  },
  {
    id: 3,
    name: "Eduardo Goncalvez",
    role: "AI/ML, Backend",
    blurb: "Hey! I'm Eduardo, a Computer Science student passionate about software development, AI, and creating tech that makes life easier. On our team, I focused on image categorization, outfit generation, and backend development. This project has been an incredible learning adventure, and I can't wait to build even more innovative AI solutions!",
    img: "eduardo.png",
    email: "eduardogoncalvez00@gmail.com" 
  },
  {
    id: 4,
    name: "Camila Gloria",
    role: "Frontend",
    blurb: "Hi, I'm Camila and I'm a Computer Science student working on the frontend team. I'm passionate about software engineering and UI/UX design! I learned a lot through this project and I'm excited to continue learning more.",
    img: "camila.png",
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
    blurb: "Hey, I'm Kevon Williams! As a Computer Science major at FIU interested in data science, I focused on backend development and testing for this project. I gained valuable experience and look forward to tackling new challenges.",
  },
  {
    id: 7,
    name: "Miles Weatherspoon",
    role: "Project Support",
    blurb: "Hey! I’m Miles Weatherspoon, a management and information systems major working on the  project support team. In this project I learned a lot about what goes into the creation and management of an AI and I’m excited to learn more.",
    img: "miles.png",
    email: "milesweatherspoon15@gmail.com"
  },
  {
    id: 8,
    name: "Alec Borque",
    role: "AI/ML, Backend",
    blurb: "Hello! My name is Alec Borque, a Computer Science major with a strong interest in data-driven problem solving and a long-term goal of becoming a quantitative analyst. In this project, I contributed through Project Support and AI Development, bringing a detail-oriented mindset and a passion for learning while working alongside a driven and collaborative team.",
    email: "alecborque@gmail.com",
    img: "alec.png",
  },
  {
    id: 9,
    name: "Alessandra Uribe",
    role: "Fashion SME, AI/ML, Database",
    img: "alessandra.png",
    blurb: "Hey! I’m Alessandra Uribe, a Computer Science student and the Fashion SME on this project. I worked on AI/ML, data testing, and helped align our tech with real-world trends. I love challenges, learning, and blending creativity with tech to make meaningful impact. Looking to continue working in future projects!",
  },
  {
    id: 10,
    name: "Laisha Bravo",
    role: "Frontend",
    blurb: "Hi my name is Laisha, I’m a junior at FIU studying CS. I contributed on the frontend, I like to make things look pretty :))",
    img: "laisha.png",
  },
  {
    id: 11,
    name: "Nathan Chen",
    role: "AI/ML, Backend",
    blurb: "Hi! I'm Nathan Chen and a Computer Science major at FIU, aspiring to become a software engineer. I helped with fine-tuning our data and assiting on additional features. The journey to learning never ends! Looking forward to more opportunities in the future!",
    img: "nathan.png",
  },
  {
    id: 12,
    name: "Abhiram Bhogi",
    role: "AI/ML, Backend",
    blurb: "Hey, I'm Abhriam!",
    img: "abhiram.png",
  },
  {
    id: 13,
    name: "Tyler Coy",
    role: "AI/ML",
    blurb: "Hey, I'm Tyler!",
  },
  {
    id: 14,
    name: "Ruben Perez",
    role: "AI/ML",
    blurb: "Hey, I'm Ruben!",
  },
  {
    id: 15,
    name: "Jayden Krishna",
    role: "Frontend",
    blurb: "Hey, I'm Jayden!",
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
