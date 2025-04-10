import "./styling/App.css";
import React, { useState } from "react";
import {Icons} from "./icons";

const Gallery = ({previewImages, onClose}) => {
    const [currentPage, setCurrentPage] = useState(0);
    const imagesPerPage = 6;
    const totalPages = Math.ceil(previewImages.length / imagesPerPage);

    const displayedImages = previewImages.slice(
        currentPage * imagesPerPage,
        (currentPage + 1) * imagesPerPage
    );

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    return (
        <div className="gallery-container">
            <button onClick={onClose}>Back</button>

            <div className="gallery">
                <Icons.LeftArrow
                    className={`arrow ${currentPage === 0 ? "hidden" : ""}`}
                    onClick={currentPage > 0 ? handlePrevPage : null}
                />

                {previewImages.length === 0 ? (
                    <div className="gallery-placeholder">No images uploaded yet.</div>
                ) : (
                    <div className="image-grid">
                        {displayedImages.map((src, index) => (
                            <div key={index} className="image-container">
                                <img src={src} alt={`Item ${index}`}/>
                            </div>
                        ))}
                        {/* Fill empty slots with placeholders */}
                        {Array.from({
                            length: imagesPerPage - displayedImages.length,
                        }).map((_, index) => (
                            <div key={`placeholder-${index}`} className="image-placeholder"></div>
                        ))}
                    </div>
                )}

                <Icons.RightArrow
                    className={`arrow ${currentPage >= totalPages - 1 ? "hidden" : ""}`}
                    onClick={currentPage < totalPages - 1 ? handleNextPage : null}
                />
            </div>
        </div>
    );
};

export default Gallery;