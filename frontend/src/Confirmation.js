import "./App.css";
import React, {useState, useEffect} from "react";

const Confirmation = ({wardrobeImages, classifications, onClose}) => {
    const categoryOptions = {
        top: [
            "t-shirt", "button-up shirt", "blouse", "polo shirt", "tank top", "sweater", "sweatshirt", "cardigan",
            "turtleneck", "crop top", "tunic", "athletic top", "henley", "flannel shirt", "printed shirt", "jacket", "dress"
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
        ],
        accessory: [
            "necklace", "bracelet", "earrings", "ring", "belt", "scarf", "hat", "bag", "watch", "sunglasses"
        ]
    };

    const colorOptions = ["black", "white", "red", "blue", "green", "yellow", "purple", "pink", "orange", "brown",
        "gray", "navy", "beige", "cream"];
    const patternOptions = ["solid", "striped", "plaid", "floral", "polka dot", "animal print", "geometric",
        "abstract", "camouflage", "tie-dye", "checkered"];
    const seasonOptions = ["spring", "summer", "fall", "winter"];
    const occasionOptions = ["casual", "work", "formal", "athletic", "outdoor", "lounge", "party", "special event",
        "beach", "travel"];

    const [updatedClassifications, setUpdatedClassifications] = useState(() => {
        return classifications.map((data) => [
            data.main_category?.[0]?.category || "",
            data.sub_category?.[0]?.category || "",
            data.color?.[0]?.category || "",
            data.pattern?.[0]?.category || "",
            data.season?.[0]?.category || "",
            data.occasion?.[0]?.category || ""
        ]);
    });

    // disable scroll on main page when popup is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    //update UI with new selections
    const handleChange = (index, fieldIndex, value) => {
        const updated = [...updatedClassifications];
        updated[index] = [...updated[index]];
        updated[index][fieldIndex] = value;
        setUpdatedClassifications(updated);
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Confirm Wardrobe Attributes</h2>

                <div className="classifications-list">
                    {wardrobeImages.map((image, index) => {
                        const classification = updatedClassifications[index] || ["", "", "", "", "", ""];

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
                                            value={classification[0]}
                                            onChange={(e) => handleChange(index, 0, e.target.value)}
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
                                            value={classification[1]}
                                            onChange={(e) => handleChange(index, 1, e.target.value)}
                                        >
                                            {categoryOptions[classification[0]]?.map((sub) => (
                                                <option key={sub} value={sub}>{sub}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="classification-container">
                                        <p>Color</p>
                                        <select
                                            className="attribute-select"
                                            value={classification[2]}
                                            onChange={(e) => handleChange(index, 2, e.target.value)}
                                        >
                                            {colorOptions.map((color) => (
                                                <option key={color} value={color}>{color}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="classification-container">
                                        <p>Pattern</p>
                                        <select
                                            className="attribute-select"
                                            value={classification[3]}
                                            onChange={(e) => handleChange(index, 3, e.target.value)}
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
                                            value={classification[4]}
                                            onChange={(e) => handleChange(index, 4, e.target.value)}
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
                                            value={classification[5]}
                                            onChange={(e) => handleChange(index, 5, e.target.value)}
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
