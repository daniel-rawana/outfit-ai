import "./App.css";
import React, {useState, useEffect} from "react";

const Confirmation = ({wardrobeImages, classifications, onClose}) => {
    const categoryOptions = {
        top: [
            "t-shirt", "button-up shirt", "blouse", "polo shirt", "tank top", "sweater", "sweatshirt", "cardigan",
            "turtleneck", "crop top", "tunic", "athletic top", "henley", "flannel shirt", "printed shirt", "jacket"
        ],
        bottom: [
            "jeans", "slacks", "chinos", "shorts", "skirt", "leggings", "sweatpants", "cargo pants", "athletic shorts",
            "bermuda shorts", "culottes", "capri pants", "palazzo pants", "cargo shorts", "denim shorts"
        ],
        footwear: [
            "sneakers", "dress shoes", "loafers", "boots", "sandals", "heels", "flats", "slip-ons", "ankle boots",
            "running shoes", "hiking shoes", "mules", "espadrilles", "boat shoes", "flip-flops"
        ],
        outerwear: [
            "jacket", "blazer", "coat", "raincoat", "windbreaker", "denim jacket", "leather jacket", "bomber jacket",
            "puffer jacket"
        ],
        dress: [
            "casual dress", "formal dress", "maxi dress", "mini dress", "sundress", "cocktail dress", "evening gown",
            "shift dress"
        ]
    };
    const styleOptions = ["casual", "formal", "business", "athletic", "streetwear", "bohemian", "vintage",
        "preppy", "minimalist", "luxury"];
    const silhouetteOptions = ["fitted", "relaxed", "oversized", "A-line", "boxy", "draped", "tailored", "flared",
        "straight", "voluminous"];
    const colorOptions = ["black", "white", "red", "blue", "green", "yellow", "purple", "pink", "orange", "brown",
        "gray", "navy", "beige", "cream"];
    const patternOptions = ["solid", "striped", "plaid", "floral", "polka dot", "graphic", "animal print",
        "geometric", "abstract", "camouflage", "tie-dye", "checkered"];
    const seasonOptions = ["spring", "summer", "fall", "winter"];
    const occasionOptions = ["casual", "work", "formal", "athletic", "outdoor", "lounge", "party", "special event",
        "beach", "travel"];

    const [updatedClassifications, setUpdatedClassifications] = useState(() => {
        return classifications.map((data) => ({
            image: data.image,
            main_category: data.main_category || "",
            sub_category: data.sub_category || "",
            style: data.style || "",
            silhouette: data.silhouette || "",
            color: data.color || "",
            pattern: data.pattern || "",
            season: data.season || "",
            occasion: data.occasion || ""
        }));
    });

    // disable scroll on main page when popup is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    //update with new selections
    const handleChange = (index, field, value) => {
        setUpdatedClassifications((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Confirm Wardrobe Attributes</h2>

                <div className="classifications-list">
                    {wardrobeImages.map((image, index) => {
                        const classification = updatedClassifications[index] || {
                            main_category: "",
                            sub_category: "",
                            style: "",
                            silhouette: "",
                            color: "",
                            pattern: "",
                            season: "",
                            occasion: "",
                        };
                        return (
                            <div key={index} className="classification-row">
                                <div className="image-container">
                                    <img src={URL.createObjectURL(image)} alt={`Outfit piece ${index}`}/>
                                </div>

                                <div className="classifications-container">
                                    <div className="classification-container">
                                        <p>Main Category</p>
                                        <select
                                            className="attribute-select"
                                            value={classification.main_category}
                                            onChange={(e) => handleChange(index, "main_category", e.target.value)}
                                        >
                                            {Object.keys(categoryOptions).map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="classification-container">
                                        <p>Subcategory</p>
                                        <select
                                            className="attribute-select"
                                            value={classification.sub_category}
                                            onChange={(e) => handleChange(index, "sub_category", e.target.value)}
                                        >
                                            {categoryOptions[classification.main_category]?.map((sub) => (
                                                <option key={sub} value={sub}>{sub}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="classification-container">
                                        <p>Color</p>
                                        <select
                                            className="attribute-select"
                                            value={classification.color}
                                            onChange={(e) => handleChange(index, "color", e.target.value)}
                                        >
                                            {colorOptions.map((color) => (
                                                <option key={color} value={color}>{color}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="classification-container">
                                        <p>Style</p>
                                        <select
                                            className="attribute-select"
                                            value={classification.style}
                                            onChange={(e) => handleChange(index, "style", e.target.value)}
                                        >
                                            {styleOptions.map((style) => (
                                                <option key={style} value={style}>{style}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="classification-container">
                                        <p>Silhouette</p>
                                        <select
                                            className="attribute-select"
                                            value={classification.silhouette}
                                            onChange={(e) => handleChange(index, "silhouette", e.target.value)}
                                        >
                                            {silhouetteOptions.map((silhouette) => (
                                                <option key={silhouette} value={silhouette}>{silhouette}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="classification-container">
                                        <p>Pattern</p>
                                        <select
                                            className="attribute-select"
                                            value={classification.pattern}
                                            onChange={(e) => handleChange(index, "pattern", e.target.value)}
                                        >
                                            {patternOptions.map((pattern) => (
                                                <option key={pattern} value={pattern}>{pattern}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="classification-container">
                                        <p>Season</p>
                                        <select
                                            className="attribute-select"
                                            value={classification.season}
                                            onChange={(e) => handleChange(index, "season", e.target.value)}
                                        >
                                            {seasonOptions.map((season) => (
                                                <option key={season} value={season}>{season}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="classification-container">
                                        <p>Occasion</p>
                                        <select
                                            className="attribute-select"
                                            value={classification.occasion}
                                            onChange={(e) => handleChange(index, "occasion", e.target.value)}
                                        >
                                            {occasionOptions.map((occasion) => (
                                                <option key={occasion} value={occasion}>{occasion}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="buttons-container">
                    <button className="confirm-btn" onClick={() => onClose(updatedClassifications)}>Confirm</button>
                    <button className="cancel-btn" onClick={() => onClose()}>Cancel</button>
                </div>

            </div>
        </div>
    );
};

export default Confirmation;
