import "./App.css";
import React from "react";

// Testing only, update later to be generated outfit
import shirt1 from "./sampleImages/shirt_1.jpg";
import pants1 from "./sampleImages/pants_1.jpg";
import shoes1 from "./sampleImages/shoes_1.jpg";

const GeneratedOutfit = () => {
    const outfit = [
        {id: 1, image: shirt1},
        {id: 2, image: pants1},
        {id: 3, image: shoes1},
    ];

    return (
        <div className="suggestion-container">
            <h1>Outfit Suggestion</h1>
            <div className="outfit-container">
                {outfit.map((item) => (
                    <div key={item.id} className="large-image-container">
                        <img src={item.image} alt="Outfit piece" className="outfit-item"/>
                    </div>
                ))}
            </div>
            <div className="buttons-container">
                <button className="new-outfit-btn">New Outfit</button>
                <button className="save-btn">Save</button>
            </div>
        </div>
    );
};

export default GeneratedOutfit;
