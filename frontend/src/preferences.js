import "./styling/App.css";
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Icons} from "./icons";

// Sample images for testing
import shirt1 from "./sampleImages/shirt_1.jpg";
import pants1 from "./sampleImages/pants_1.jpg";
import shoes1 from "./sampleImages/shoes_1.jpg";
import shirt2 from "./sampleImages/shirt_2.jpg";
import pants2 from "./sampleImages/pants_2.jpg";
import shoes2 from "./sampleImages/shoes_2.png";
import sweater1 from "./sampleImages/sweater_1.jpg";

const Preferences = () => {
    const navigate = useNavigate();
    const [isGenerating, setIsGenerating] = useState(false);
    const [weather, setWeather] = useState('');
    const [occasion, setOccasion] = useState('');
    const [color, setColor] = useState('');

    const weather_options = [
        "hot", "warm", "cool", "cold", "rainy"
    ];

    const occasions = [
        "casual", "work", "formal", "athletic", "outdoor", "lounge", "party", "special event"
    ];

    const colors = [
        "black", "white", "red", "blue", "green", "yellow", "purple", "pink", "orange", "brown",
        "gray", "navy", "beige", "cream"
    ];

    const handleGenerate = async () => {
        setIsGenerating(true);

        try {
            // Create an object with the preferences
            const preferences = {
                weather: weather,
                occasion: occasion,
                color: color
            };


            const generateResponse = await fetch("http://127.0.0.1:5000/outfits/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(preferences)
            });

            if (!generateResponse.ok) {
                throw new Error("Failed to generate outfit.");
            }

            const outfitData = await generateResponse.json();

            setIsGenerating(false);

            /* testing purposes only, simulates delay of API call with dummy outfit
            const dummyOutfits = [[
                {id: 1, image: shirt1},
                {id: 2, image: pants1},
                {id: 3, image: shoes1},
            ], [
                {id: 1, image: shirt2},
                {id: 2, image: pants2},
                {id: 3, image: shoes2},
            ], [
                {id: 1, image: sweater1},
                {id: 2, image: pants1},
                {id: 3, image: shoes2},
            ]];

            setTimeout(() => {
                setIsGenerating(false);
                navigate("/generated-outfit", {state: {outfitSuggestions: dummyOutfits}});
            }, 1000);
            */

            navigate("/generated-outfit", {state: {outfitSuggestions: outfitData.outfit}});
        } catch (error) {
            console.error("Error during outfit generation:", error);
            setIsGenerating(false);
        }
    };

    return (
        <div className="preferences-container">
            <div className="preference-text-container">
                <h1>Select Your Preferences</h1>
                <h3>Customize your outfit with these selections—optional but recommended for the
                    perfect look!</h3>
            </div>

            <div className="preference-container">
                <h2>Weather:</h2>
                <select value={weather} onChange={(e) => setWeather(e.target.value)}>
                    <option value="" disabled>Select</option>
                    {weather_options.map((wea) => (
                        <option key={wea} value={wea}>{wea}</option>
                    ))}
                </select>
            </div>

            <div className="preference-container">
                <h2>Occasion:</h2>
                <select value={occasion} onChange={(e) => setOccasion(e.target.value)}>
                    <option value="" disabled>Select</option>
                    {occasions.map((occ) => (
                        <option key={occ} value={occ}>{occ}</option>
                    ))}
                </select>
            </div>

            <div className="preference-container">
                <h2>Color:</h2>
                <select value={color} onChange={(e) => setColor(e.target.value)}>
                    <option value="" disabled>Select</option>
                    {colors.map((col) => (
                        <option key={col} value={col}>{col}</option>
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
