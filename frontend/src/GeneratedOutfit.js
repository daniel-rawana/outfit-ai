import "./App.css";
import React from "react";

const GeneratedOutfit = () => {
    const outfit = [
        {id: 1, image: "../sampleImages/shirt_1.jpg"},
        {id: 2, image: "sampleImages/pants_1.jpg"},
        {id: 3, image: "sampleImages/shoes_1.jpg"},
    ];

    return (
        <div className="outfit-container">
            <h2>Outfit Suggestion</h2>
            <div className="outfit-grid">
                {outfit.map((item) => (
                    <img key={item.id} src={item.image} alt="Outfit piece" className="outfit-item"/>
                ))}
            </div>
            <button className="save-button">Save</button>
        </div>
    );
};

export default GeneratedOutfit;
