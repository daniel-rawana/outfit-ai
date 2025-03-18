import "./App.css";
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Icons} from "./assets/icons";

// Sample images for testing
import shirt1 from "./sampleImages/shirt_1.jpg";
import pants1 from "./sampleImages/pants_1.jpg";
import shoes1 from "./sampleImages/shoes_1.jpg";

const Preferences = () => {
    const navigate = useNavigate();
    const [isGenerating, setIsGenerating] = useState(false);
    const [season, setSeason] = useState('summer');
    const [occasion, setOccasion] = useState('casual');

    const seasons = [
        "spring", "summer", "fall", "winter"
    ];

    const occasions = [
        "casual", "work", "formal", "athletic", "outdoor", "lounge", "party", "special event"
    ];

    const handleGenerate = async () => {
        setIsGenerating(true);

        try {
            const generateResponse = await fetch("http://127.0.0.1:5000/outfits/generate", {
                method: "POST",
            });

            if (!generateResponse.ok) {
                throw new Error("Failed to generate outfit.");
            }

            const outfitData = await generateResponse.json();

            setIsGenerating(false);

            /* testing purposes only, simulates delay of API call with dummy outfit
            const dummyOutfit = [
                {id: 1, image: shirt1},
                {id: 2, image: pants1},
                {id: 3, image: shoes1},
            ];

            setTimeout(() => {
                setIsGenerating(false);
                navigate("/generated-outfit", {state: {outfit: dummyOutfit}});
            }, 1000);
            */

            navigate("/generated-outfit", {state: {outfit: outfitData.outfit}});
        } catch (error) {
            console.error("Error during outfit generation:", error);
            setIsGenerating(false);
        }
    };

    return (
        <div className="preferences-container">
            <h1>Select Your Preferences</h1>

            <div className="preference-container">
                <h2>Season:</h2>
                <select value={season} onChange={(e) => setSeason(e.target.value)}>
                    {seasons.map((seas) => (
                        <option key={seas} value={seas}>{seas}</option>
                    ))}
                </select>
            </div>

            <div className="preference-container">
                <h2>Occasion:</h2>
                <select value={occasion} onChange={(e) => setOccasion(e.target.value)}>
                    {occasions.map((occ) => (
                        <option key={occ} value={occ}>{occ}</option>
                    ))}
                </select>
            </div>

            <button className="generate-btn" onClick={handleGenerate} disabled={isGenerating}>
                <Icons.Generate className="generate"/> Generate
            </button>

            {/* "generating" popup */}
            {isGenerating && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <Icons.Loading className="spinner"/>
                        <p id="popup-text">Generating your outfit...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Preferences;
