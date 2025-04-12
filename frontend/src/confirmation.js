import "./styling/App.css";
import React, {useState, useEffect} from "react";

const Confirmation = ({existingClassifications, newClassifications, onClose}) => {
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

    const [updatedNewClassifications, setUpdatedNewClassifications] = useState(() => newClassifications.map(data => ({...data})));
    const [updatedExistingClassifications, setUpdatedExistingClassifications] = useState(() => existingClassifications.map(data => ({...data})));

    // disable scroll on main page when popup is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    //update with new selections for existing and new classifications
    const handleChange = (index, field, value, type) => {
        if (type === "new") {
            setUpdatedNewClassifications((prev) => {
                const updated = [...prev];
                updated[index] = { ...updated[index], [field]: value };
                return updated;
            });
        } else {
            setUpdatedExistingClassifications((prev) => {
                const updated = [...prev];
                updated[index] = { ...updated[index], [field]: value };
                return updated;
            });
        }
    };

    const renderClassificationRow = (classification, index, type) => {
        const isBase64 = classification.image && !classification.image.startsWith("http");
        const imageSrc = isBase64
            ? `data:image/png;base64,${classification.image}`
            : classification.image;
        return (
            <div key={index} className={type === "new" ? "new-classification-row" : "classification-row"}>
                <div className="image-container">
                    <img src={imageSrc} alt={`Outfit piece ${index}`} />
                </div>
                <div className="classifications-container">
                    {Object.entries({
                        main_category: Object.keys(categoryOptions),
                        sub_category: categoryOptions[classification.main_category],
                        style: styleOptions,
                        silhouette: silhouetteOptions,
                        color: colorOptions,
                        pattern: patternOptions,
                        season: seasonOptions,
                        occasion: occasionOptions
                    }).map(([key, selectionOptions]) => (
                        <div key={key} className="classification-container">
                            <p>{key.replace("_", " ")}:</p>
                            <select
                                className="attribute-select"
                                value={classification[key] || ""}
                                onChange={(e) => handleChange(index, key, e.target.value, type)}
                            >
                                <option value="">Select</option>
                                {selectionOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const handleConfirm = () => {
        // filter existing classifications to only include modified ones
        const modifiedExisting = updatedExistingClassifications.filter((item, index) =>
            JSON.stringify(item) !== JSON.stringify(existingClassifications[index])
        );

        // send back classifications for new items + existing items that have been modified
        onClose({
            newItems: updatedNewClassifications,
            modifiedExisting: modifiedExisting
        });
    };

    const handleClose = () => {
        // send back unmodified classifications for new items
        onClose({
            newItems: newClassifications,
            modifiedExisting: []
        });
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Edit Wardrobe Attributes</h2>
                <p>Please confirm the classifications RunwAI has assigned to your clothing items.</p>

                <div className="classifications-list">
                    {updatedNewClassifications.map((classification, index) => renderClassificationRow(classification, index, "new"))}
                    {updatedExistingClassifications.map((classification, index) => renderClassificationRow(classification, index, "existing"))}
                </div>

                <div className="buttons-container">
                    <button className="confirm-btn" onClick={handleConfirm}>Confirm</button>
                    <button className="cancel-btn" onClick={handleClose}>Cancel</button>
                </div>

            </div>
        </div>
    );
};

export default Confirmation;
