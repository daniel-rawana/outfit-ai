import "./App.css";
import React, { useState } from "react";
import { Icons } from "./assets/icons";

function App() {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const imagesPerPage = 9; // 3x3 grid, 9 images per page

  const handleUpload = (event) => {
    const files = event.target.files;
    if (files) {
      const newImages = [...images, ...Array.from(files).map((file) => URL.createObjectURL(file))];
      setImages(newImages);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const totalPages = Math.ceil(images.length / imagesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Calculate the images to display for the current page
  const displayedImages = images.slice(currentPage * imagesPerPage, (currentPage + 1) * imagesPerPage);

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <Icons.Logo size={30} /> AI Stylist
        </div>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact Us</a></li>
          <li><button className="login-btn">Login</button></li>
        </ul>
      </nav>

      {/* Main Section */}
      <div className="main-content">
        <div className="sidebar">
          <h1>Welcome to AI Stylist</h1>
          <p>An AI-powered project that generates outfit suggestions based on your uploaded wardrobe items.</p>
          <label className="upload-btn">
            <Icons.Upload className="upload"/> Upload
            <input type="file" multiple onChange={handleUpload} hidden />
          </label>
          <button className="generate-btn">
            <Icons.Generate className="generate" /> Generate
          </button>
        </div>

        {/* Image Grid with Arrows */}
        <div className="image-gallery">
          {currentPage > 0 && <Icons.LeftArrow className="arrow" onClick={handlePrevPage} />}
          {displayedImages.length === 0 ? (
            <p>No images uploaded yet.</p>
          ) : (
            <div className="image-grid">
              {displayedImages.map((src, index) => (
                <div key={index} className="image-container">
                  <img src={src} alt={`Item ${index}`} />
                  <button className="remove-btn" onClick={() => removeImage(index)}>
                    <Icons.XButton className="x"/>
                  </button>
                </div>
              ))}
            </div>
          )}
          {currentPage < totalPages - 1 && <Icons.RightArrow className="arrow" onClick={handleNextPage} />}
        </div>
      </div>
    </div>
  );
}

export default App;
