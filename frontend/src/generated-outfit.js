import "./styling/App.css";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icons } from "./icons";
import confetti from "canvas-confetti";

const GeneratedOutfit = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const outfitSuggestions = location.state?.outfitSuggestions || [];
    const [showToast, setShowToast] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [editedNames, setEditedNames] = useState({});
    const [editing, setEditing] = useState(false);
    const [inputValue, setInputValue] = useState("");

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
        setEditing(false);
    };

    const prevOutfit = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + outfitSuggestions.length) % outfitSuggestions.length);
        setEditing(false);
    };

    const toggleEditing = () => {
        if (!editing) {
            setInputValue(editedNames[currentIndex] || `Outfit Suggestion ${currentIndex + 1}`);
            setEditing(true);
        } else {
            setEditing(false);
        }
    };

    const handleNameChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            setEditedNames({ ...editedNames, [currentIndex]: inputValue.trim() });
            setEditing(false);
        }
    };

    const handleSaveOutfit = async () => {
        if (outfitSuggestions.length === 0) return;

        const currentOutfit = outfitSuggestions[currentIndex];
        const outfitName = editedNames[currentIndex] || `Saved Outfit ${currentIndex + 1}`;
        const outfitPayload = {
            outfit_name: outfitName,
            outfit: currentOutfit.map(item => ({ id: item.id })),
        };

        try {
            const response = await fetch("http://127.0.0.1:5000/outfits/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(outfitPayload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Outfit saved to backend:", result);

            const outfitToSave = currentOutfit.map(item => ({ image: item.image }));
            const existing = JSON.parse(localStorage.getItem("savedOutfits")) || [];
            existing.push({
                outfit: outfitToSave,
                outfit_name: outfitName,
                timestamp: Date.now(),
            });
            localStorage.setItem("savedOutfits", JSON.stringify(existing));

            confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 }
            });

            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 1800);
        } catch (error) {
            console.error("Error saving outfit:", error);
            alert("Failed to save outfit.");
        }
    };

    return loading ? (
        <div className="loading-container">
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

                        <button
                            className="continue-btn"
                            onClick={() => setShowPopup(false)}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            <div className="suggestion-container">
                <div className="suggestion">
                    {outfitSuggestions.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            {editing ? (
                                <>
                                    <div className="outfit-title-container">
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={handleNameChange}
                                            onKeyDown={handleKeyDown}
                                            className="editable-name-input"
                                            autoFocus
                                        />
                                        <Icons.XButton className="cancel" onClick={toggleEditing}/>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="outfit-title-container">
                                        <h1 className="editable-title">✨ {editedNames[currentIndex] || `Outfit Suggestion ${currentIndex + 1}`} ✨</h1>
                                        <Icons.Edit className="edit" onClick={toggleEditing}/>
                                    </div>

                                </>
                            )}
                        </div>
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

                    {showToast && (
                        <div className="toast-notification">
                            🎉 Outfit saved successfully!
                        </div>
                    )}

                    <div className="buttons-container">
                        <button className="save-btn" onClick={handleSaveOutfit}>Save Outfit</button>
                        <button className="view-saved-btn" onClick={() => navigate("/saved-outfits")}>
                            View Saved Outfits
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GeneratedOutfit;
