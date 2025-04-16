import React, { useEffect, useState } from "react";

function SavedOutfits() {
    const [savedOutfits, setSavedOutfits] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedOutfit, setSelectedOutfit] = useState(null);

    useEffect(() => {
        fetchOutfits();
    }, []);

    const fetchOutfits = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/outfits/saved");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const outfitData = await response.json();
            if (outfitData.outfits && outfitData.outfits.length > 0) {
                setSavedOutfits(outfitData.outfits);
            }
        } catch (error) {
            console.error("Error fetching wardrobe: ", error);
        }
    };

    const openPopup = (outfit) => {
        setSelectedOutfit(outfit);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setSelectedOutfit(null);
    };

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>My Wardrobe</h1>
            {savedOutfits.length === 0 ? (
                <p>No saved outfits yet. Go generate and save some!</p>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent:'center' }}>
                    {savedOutfits.map((entry, index) => (
                        <div
                            key={entry.id || index}
                            className="saved-outfit-card"
                            onClick={() => openPopup(entry)}
                            style={{ cursor: 'pointer' }}
                        >
                            <h3 style={{ textAlign: 'center', marginTop: '0', color: 'white' }}>
                                {entry.name || `Outfit #${index + 1}`}
                            </h3>
                            <div className="mini-outfit-pieces">
                                {entry.items.map((piece, idx) => (
                                    <img
                                        className="mini-outfit-img"
                                        key={piece.id || idx}
                                        src={piece.image}
                                        alt={`Outfit ${index + 1} - Piece ${idx + 1}`}
                                        title={`${piece.main_category} - ${piece.color}`}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showPopup && selectedOutfit && (
                <div className="popup-overlay">
                    <div className="popup-outfit-card">
                        <h2 className="outfit-title">Outfit Preview</h2>
                        <div className="popup-clothes-grid">
                            {selectedOutfit.items.map((piece, idx) => (
                                <div key={piece.id || idx} className="large-image-container">
                                    <img
                                        src={piece.image}
                                        alt={`Item ${idx + 1}`}
                                    />
                                </div>
                            ))}
                        </div>
                        <button className="continue-btn" onClick={closePopup}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SavedOutfits;
