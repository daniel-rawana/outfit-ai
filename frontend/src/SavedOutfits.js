import React, { useEffect, useState } from "react";

function SavedOutfits() {
    const [outfits, setOutfits] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("savedOutfits")) || [];
        setOutfits(saved);
    }, []);

    const deleteOutfit = (indexToDelete) => {
        const updated = outfits.filter((_, i) => i !== indexToDelete);
        setOutfits(updated);
        localStorage.setItem("savedOutfits", JSON.stringify(updated));
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Saved Outfits</h2>
            {outfits.length === 0 ? (
                <p>No hay atuendos guardados aún.</p>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    {outfits.map((outfitObj, index) => (
                        <div key={index} style={{
                            border: '1px solid #ccc',
                            padding: '1rem',
                            borderRadius: '8px',
                            width: '250px',
                            backgroundColor: '#f9f9f9'
                        }}>
                            <p style={{ fontSize: '0.8rem', color: '#666' }}>
                                Guardado: {new Date(outfitObj.timestamp).toLocaleString()}
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {outfitObj.outfit.map((item, i) => (
                                    <img
                                        key={i}
                                        src={item.image}
                                        alt={`Outfit piece ${i}`}
                                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '6px' }}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={() => deleteOutfit(index)}
                                style={{
                                    marginTop: '0.5rem',
                                    padding: '0.3rem 0.6rem',
                                    fontSize: '0.8rem',
                                    color: 'white',
                                    backgroundColor: 'crimson',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SavedOutfits;
