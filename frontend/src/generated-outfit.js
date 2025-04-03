import "./styling/App.css";
import React, {useState} from "react";
import {useLocation} from "react-router-dom";
import {Icons} from "./icons";

const GeneratedOutfit = () => {
    const location = useLocation();
    const outfitSuggestions = location.state?.outfitSuggestions || [];
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextOutfit = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % outfitSuggestions.length);
    };

    const prevOutfit = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + outfitSuggestions.length) % outfitSuggestions.length);
    };

    return (
        <div className="suggestion-container">
            {outfitSuggestions.length > 0 && (
                <h1>Outfit Suggestion #{currentIndex + 1}</h1>
            )}
            <div className="outfit-container">
                {outfitSuggestions.length > 0 && (
                    <Icons.LeftArrow fill="white" className="suggestion-arrow" onClick={prevOutfit}/>
                )}

                {outfitSuggestions.length > 0 ? (
                    outfitSuggestions[currentIndex].map((item, index) => (
                        <div key={index} className="large-image-container">
                            <img src={item.image} alt={`Outfit piece ${index}`} className="outfit-item"/>
                        </div>
                    ))
                ) : (
                    <p>No wardrobe items in outfit.</p>
                )}

                {outfitSuggestions.length > 0 && (
                    <Icons.RightArrow fill="white" className="suggestion-arrow" onClick={nextOutfit}/>
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
