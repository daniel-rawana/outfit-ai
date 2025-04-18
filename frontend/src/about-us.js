import React from 'react';
import './styling/about-us.css';
import runwAILogo from './assets/runwai_logo.png';


const AboutUs = () => {
  return (
    <>
      <div className="page-header">
        <div className="img-div">
          <img src={runwAILogo} alt="RunwAI Logo" className="logo-image"/>
        </div>
        <h1>RunwAI</h1>
        <p>Empowering Your Wardrobe with AI</p>
      </div>
      
      <div className="main">
        <h2>About Us</h2>
        <p>
          Welcome to RunwAI! RunwAI is an 
          AI-powered fashion assistant that helps users discover and create stylish outfits effortlessly. 
          By analyzing clothing items from photos and combining your personal style with popular fashion trends, RunwAI curates outfit recommendations 
          that are tailored to your preferences. Our goal is to make fashion more accessible and personalized through advanced AI technology.
        </p>
        <h2>Our Mission</h2>
        <p>
          At RunwAI, we are passionate about revolutionizing personal style through cutting-edge artificial intelligence. 
          We believe that everyone deserves to feel confident and express themselves through fashion, regardless of their styling expertise.
        </p>
      </div>
      <footer class="site-footer">
        <p>© 2025 RunwAI – All rights reserved.</p>
      </footer>
    </>
  );
};

export default AboutUs;