import React, { useEffect, useState } from "react";

function SavedOutfits() {
    const [savedOutfits, setSavedOutfits] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedOutfit, setSelectedOutfit] = useState(null);
    const [occasion, setOccasion] = useState('');
    const [style, setStyle] = useState('');
    const [silhouette, setSilhouette] = useState('');
    const [color, setColor] = useState('');
    const [pattern, setPattern] = useState('');
    const [season, setSeason] = useState('');

    const occasions = [
        "casual", "work", "formal", "athletic", "outdoor", "lounge", "party", "special event"
    ];
    const styles = ["casual", "formal", "business", "athletic", "streetwear", "bohemian", "vintage",
        "preppy", "minimalist", "luxury"];
    const silhouettes = ["fitted", "relaxed", "oversized", "A-line", "boxy", "draped", "tailored", "flared",
        "straight", "voluminous"];
    const colors = ["black", "white", "red", "blue", "green", "yellow", "purple", "pink", "orange", "brown",
        "gray", "navy", "beige", "cream"];
    const patterns = ["solid", "striped", "plaid", "floral", "polka dot", "graphic", "animal print",
        "geometric", "abstract", "camouflage", "tie-dye", "checkered"];
    const seasons = ["spring", "summer", "fall", "winter"];

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
        <div style={{padding: '2rem', textAlign: 'center'}}>
            <h1>My Outfits</h1>

            <div className="filter-container">
                <select className="attribute-select" value={occasion} onChange={(e) => setOccasion(e.target.value)}>
                    <option value="">All Occasions</option>
                    {occasions.map((val) => (
                        <option key={val} value={val}>{val}</option>
                    ))}
                </select>

                <select className="attribute-select" value={style} onChange={(e) => setStyle(e.target.value)}>
                    <option value="">All Styles</option>
                    {styles.map((val) => (
                        <option key={val} value={val}>{val}</option>
                    ))}
                </select>

                <select className="attribute-select" value={silhouette} onChange={(e) => setSilhouette(e.target.value)}>
                    <option value="">All Silhouettes</option>
                    {silhouettes.map((val) => (
                        <option key={val} value={val}>{val}</option>
                    ))}
                </select>

                <select className="attribute-select" value={color} onChange={(e) => setColor(e.target.value)}>
                    <option value="">All Colors</option>
                    {colors.map((val) => (
                        <option key={val} value={val}>{val}</option>
                    ))}
                </select>

                <select className="attribute-select" value={pattern} onChange={(e) => setPattern(e.target.value)}>
                    <option value="">All Patterns</option>
                    {patterns.map((val) => (
                        <option key={val} value={val}>{val}</option>
                    ))}
                </select>

                <select className="attribute-select" value={season} onChange={(e) => setSeason(e.target.value)}>
                    <option value="">All Seasons</option>
                    {seasons.map((val) => (
                        <option key={val} value={val}>{val}</option>
                    ))}
                </select>
            </div>

            {savedOutfits.length === 0 ? (
                <p>No saved outfits yet. Go generate and save some!</p>
            ) : (
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'}}>
                    {(() => {
                        const filteredOutfits = savedOutfits.filter((entry) => {
                            return entry.items.some((item) => {
                                const matchesOccasion = !occasion || item.occasion?.includes(occasion);
                                const matchesStyle = !style || item.style?.includes(style);
                                const matchesSilhouette = !silhouette || item.silhouette?.includes(silhouette);
                                const matchesColor = !color || item.color?.includes(color);
                                const matchesPattern = !pattern || item.pattern?.includes(pattern);
                                const matchesSeason = !season || item.season?.includes(season);

                                return matchesOccasion && matchesStyle && matchesSilhouette &&
                                    matchesColor && matchesPattern && matchesSeason;
                            });
                        });

                        if (filteredOutfits.length === 0) {
                            return <p>No outfits match your current filters.</p>;
                        }

                        return (
                            <div style={{display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center'}}>
                                {filteredOutfits.map((entry, index) => (
                                    <div
                                        key={entry.id || index}
                                        className="saved-outfit-card"
                                        onClick={() => openPopup(entry)}
                                        style={{cursor: 'pointer'}}
                                    >
                                        <h3 style={{textAlign: 'center', marginTop: '0', color: 'white'}}>
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
                        );
                    })()}
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
