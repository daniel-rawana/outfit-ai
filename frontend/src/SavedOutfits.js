import React, { useEffect, useState } from "react";

function SavedOutfits() {
    const [savedOutfits, setSavedOutfits] = useState([]);

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

    return (
        <div style={{ padding: '2rem' }}>
            <h2>👗 Saved Outfits</h2>
            {savedOutfits.length === 0 ? (
                <p>No saved outfits yet. Go generate and save some!</p>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                    {savedOutfits.map((entry, index) => (
                        <div
                            key={entry.id || index}
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: '12px',
                                padding: '1rem',
                                background: '#fafafa',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                width: 'fit-content',
                                maxWidth: '300px'
                            }}
                        >
                            <h4 style={{ textAlign: 'center' }}>
                                {entry.name || `Outfit #${index + 1}`}
                            </h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                                {entry.items.map((piece, idx) => (
                                    <img
                                        key={piece.id || idx}
                                        src={piece.image}
                                        alt={`Outfit ${index + 1} - Piece ${idx + 1}`}
                                        title={`${piece.main_category} - ${piece.color}`}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            border: '1px solid #ddd'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SavedOutfits;
