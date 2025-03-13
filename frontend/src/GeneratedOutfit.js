import "./App.css";
import React from "react";
import {useLocation} from "react-router-dom";

const GeneratedOutfit = () => {
    const location = useLocation();
    const outfit = location.state?.outfit || [];

    return (
        <div className="suggestion-container">
            <h1>Outfit Suggestion</h1>
            <div className="outfit-container">
                {outfit.length > 0 ? (
                    outfit.map((item, index) => (
                        <div key={index} className="large-image-container">
                            <img src={item.image} alt={`Outfit piece ${index}`} className="outfit-item"/>
                        </div>
                    ))
                ) : (
                    <p>No outfit generated.</p>
                )}
            </div>
            <div className="buttons-container">
                <button className="new-outfit-btn">New Outfit</button>
                <button className="save-btn">Save</button>
            </div>
        </div>
    );
};

export default GeneratedOutfit;
