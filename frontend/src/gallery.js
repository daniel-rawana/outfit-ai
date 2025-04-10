import "./styling/App.css";
import React, { useState, useMemo } from "react";
import { Icons } from "./icons";

const categoryMap = {
    Tops: "top",
    Bottoms: "bottom",
    Shoes: "footwear",
    Outerwear: "outerwear",
    Dress: "dress",
    All: null,
};

const Gallery = ({ wardrobeItems, selectedCategory, onClose, onImageClick }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const imagesPerPage = 9;
    const filteredItems = useMemo(() => {
        const categoryKey = categoryMap[selectedCategory];
        if (!categoryKey) return wardrobeItems;
        return wardrobeItems.filter(item => item.main_category === categoryKey);
    }, [wardrobeItems, selectedCategory]);
    const totalPages = Math.ceil(filteredItems.length / imagesPerPage);
    const displayedItems = useMemo(() => {
        return filteredItems.slice(
            currentPage * imagesPerPage,
            (currentPage + 1) * imagesPerPage
        );
    }, [filteredItems, currentPage]);

    const preloadImages = useMemo(() => {
        const next = filteredItems.slice((currentPage + 1) * imagesPerPage, (currentPage + 2) * imagesPerPage);
        const prev = filteredItems.slice((currentPage - 1) * imagesPerPage, currentPage * imagesPerPage);
        return [...next, ...prev].map(item => item.image);
    }, [filteredItems, currentPage]);

    preloadImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    return (
        <div className="gallery-container">
            <div className="gallery-top-bar">
                <button className="cancel-btn" onClick={onClose}>Back</button>
                <div className="page-count">
                    Page {currentPage + 1} of {totalPages}
                </div>
            </div>

            <div className="gallery">
                <Icons.LeftArrow
                    className={`arrow ${currentPage === 0 ? "hidden" : ""}`}
                    onClick={currentPage > 0 ? handlePrevPage : null}
                />

                {filteredItems.length === 0 ? (
                    <div className="gallery-placeholder">No clothing items found.</div>
                ) : (
                    <div className="image-grid">
                        {displayedItems.map((item, index) => (
                            <div
                                key={index}
                                className="image-container"
                                onClick={() => onImageClick(item)}
                            >
                                <img src={item.image} alt={`Item ${index}`} loading="lazy" />
                            </div>
                        ))}
                        {Array.from({ length: imagesPerPage - displayedItems.length }).map((_, index) => (
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

export default React.memo(Gallery);
