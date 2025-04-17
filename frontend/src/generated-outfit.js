import "./styling/App.css";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icons } from "./icons";
import confetti from "canvas-confetti";

const GeneratedOutfit = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const outfitSuggestions = location.state?.outfitSuggestions || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false);
            setShowPopup(true);
        }, 2000);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (showPopup) {
            const confettiCanvas = document.createElement("canvas");
            confettiCanvas.style.position = "fixed";
            confettiCanvas.style.top = "0";
            confettiCanvas.style.left = "0";
            confettiCanvas.style.width = "100%";
            confettiCanvas.style.height = "100%";
            confettiCanvas.style.pointerEvents = "none";
            confettiCanvas.style.zIndex = "9999";

            document.body.appendChild(confettiCanvas);

            const myConfetti = confetti.create(confettiCanvas, {
                resize: true,
                useWorker: true,
            });

            myConfetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
            });

            setTimeout(() => {
                document.body.removeChild(confettiCanvas);
            }, 2000);
        }
    }, [showPopup]);

    const nextOutfit = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % outfitSuggestions.length);
    };

    const prevOutfit = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + outfitSuggestions.length) % outfitSuggestions.length);
    };

    const saveOutfit = () => {
        if (outfitSuggestions.length === 0) return;

        const outfitToSave = outfitSuggestions[currentIndex].map(item => ({
            image: item.image
        }));

        const existing = JSON.parse(localStorage.getItem("savedOutfits")) || [];
        existing.push({
            outfit: outfitToSave,
            timestamp: Date.now()
        });

        localStorage.setItem("savedOutfits", JSON.stringify(existing));

        // Trigger confetti on save
        confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
        });

        // Show toast message
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
            navigate("/saved-outfits");
        }, 1800);
    };

    return loading ? (
        <div className="suggestion-container">
            <div className="results-loading">
                <div className="sparkle-spinner"></div>
                <p className="loading-text">✨ Preparing your outfits... ✨</p>
            </div>
        </div>
    ) : (
        <>
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-reveal-card">
                        <h2 className="reveal-title">✨ Your Outfits are Ready! ✨</h2>
                        <div className="popup-outfits-grid">
                            {outfitSuggestions.map((outfit, index) => (
                                <div key={index} className="outfit-preview-card">
                                    <p className="outfit-label">Outfit {index + 1}</p>
                                    <div className="mini-outfit-pieces">
                                        {outfit.map((piece, idx) => (
                                            <img
                                                key={idx}
                                                src={piece.image}
                                                alt={`Outfit ${index + 1} - Piece ${idx + 1}`}
                                                className="mini-outfit-img"
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="continue-btn" onClick={() => setShowPopup(false)}>
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {showToast && (
                <div className="toast-notification">
                    🎉 Outfit saved successfully!
                </div>
            )}

            <div className="suggestion-container">
                {outfitSuggestions.length > 0 && (
                    <h1>✨ Outfit Suggestion {currentIndex + 1} ✨</h1>
                )}
                <div className="outfit-container">
                    {outfitSuggestions.length > 0 && (
                        <Icons.LeftArrow fill="white" className="suggestion-arrow" onClick={prevOutfit} />
                    )}

                    {outfitSuggestions.length > 0 ? (
                        outfitSuggestions[currentIndex].map((item, index) => (
                            <div key={index} className="large-image-container">
                                <img src={item.image} alt={`Outfit piece ${index}`} className="outfit-item" />
                            </div>
                        ))
                    ) : (
                        <p>No wardrobe items in outfit.</p>
                    )}

                    {outfitSuggestions.length > 0 && (
                        <Icons.RightArrow fill="white" className="suggestion-arrow" onClick={nextOutfit} />
                    )}
                </div>

                <div className="buttons-container">
                    <button className="new-outfit-btn">New Outfit</button>
                    <button className="save-btn" onClick={saveOutfit}>Save</button>
                    <button className="view-saved-btn" onClick={() => navigate("/saved-outfits")}>
                        View Saved Outfits
                    </button>
                </div>
            </div>
        </>
    );
};

export default GeneratedOutfit;

