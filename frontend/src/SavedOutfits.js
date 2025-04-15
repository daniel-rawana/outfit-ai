import React, { useEffect, useState } from "react";

function SavedOutfits() {
    const [savedOutfits, setSavedOutfits] = useState([]);

    useEffect(() => {
        const data = localStorage.getItem("savedOutfits");
        if (data) {
            setSavedOutfits(JSON.parse(data));
        }
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <h2>👗 Saved Outfits</h2>
            {savedOutfits.length === 0 ? (
                <p>No saved outfits yet. Go generate and save some!</p>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                    {savedOutfits.map((entry, index) => (
                        <div
                            key={index}
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: '12px',
                                padding: '1rem',
                                background: '#fafafa',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                width: 'fit-content'
                            }}
                        >
                            <h4 style={{ textAlign: 'center' }}>Outfit #{index + 1}</h4>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {entry.outfit.map((piece, idx) => (
                                    <img
                                        key={idx}
                                        src={piece.image}
                                        alt={`Outfit ${index + 1} - Piece ${idx + 1}`}
                                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
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

