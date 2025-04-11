import "./styling/App.css";
import React, { useState, useEffect } from "react";
import { Icons } from "./icons";
import { useNavigate } from "react-router-dom";
import Confirmation from "./confirmation";
import Gallery from "./gallery";

function HomePage() {
    const [wardrobeItems, setWardrobeItems] = useState([]);
    const [uploadedImages, setUploadedImages] = useState([]);
    const navigate = useNavigate();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationData, setConfirmationData] = useState({ existingClassifications: [], newClassifications: [] });
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showGallery, setShowGallery] = useState(false);
    const [showCategories, setShowCategories] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        fetchWardrobe();
    }, []);

    useEffect(() => {
        if (uploadedImages.length > 0) {
            uploadImages();
        }
    }, [uploadedImages]);

    const fetchWardrobe = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/wardrobe/fetch-user-items");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const wardrobeData = await response.json();
            if (wardrobeData.length > 0) {
                const wardrobe = wardrobeData.map(item => ({
                    image: item.image,
                    main_category: item.main_category || "",
                    sub_category: item.sub_category || "",
                    style: item.style || "",
                    silhouette: item.silhouette || "",
                    color: item.color || "",
                    pattern: item.pattern || "",
                    season: item.season || "",
                    occasion: item.occasion || "",
                }));
                setWardrobeItems(wardrobe);
            }
        } catch (error) {
            console.error("Error fetching wardrobe: ", error);
        }
    };

    const uploadImages = async () => {
        if (uploadedImages.length === 0) return;
        setIsAnalyzing(true);
        const base64Images = await Promise.all(
            uploadedImages.map((image) => convertToBase64(image))
        );
        try {
            const response = await fetch("http://127.0.0.1:5000/wardrobe/classify-clothing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ images: base64Images }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            console.log("Upload successful:", result);
            const newClassifications = result.message;
            setUploadedImages([]);
            setIsAnalyzing(false);
            openConfirmation({
                newItems: newClassifications,
                existingItems: [],
            });
        } catch (error) {
            console.error("Error uploading images: ", error);
            setIsAnalyzing(false);
        }
    };

    const handleGenerate = () => {
        if (wardrobeItems.length === 0) {
            alert("Please upload some wardrobe items first.");
            return;
        }
        navigate('/preferences');
    };

    const handleUpload = async (event) => {
        const files = Array.from(event.target.files);
        const validImageTypes = ['image/jpeg', 'image/png'];
        const imageFiles = files.filter(file => validImageTypes.includes(file.type));
        if (imageFiles.length === 0) {
            alert('Please upload only JPEG or PNG images.');
            return;
        }
        const existingImages = wardrobeItems.map(item => item.image);
        const newImageFiles = [];
        for (let file of imageFiles) {
            const base64String = await convertToBase64(file);
            if (!existingImages.includes(base64String)) { newImageFiles.push(file); }
        }
        if (newImageFiles.length === 0) {
            alert('This image has already been uploaded.');
            return;
        }
        setUploadedImages(prev => [...prev, ...newImageFiles]);
    };

    const handleGalleryClose = () => {
        setShowGallery(false)
        setShowCategories(true)
    }

    const openConfirmation = ({ newItems = [], existingItems = [] }) => {
        setConfirmationData({
            existingClassifications: existingItems,
            newClassifications: newItems,
        });
        setShowConfirmation(true);
    };

    const handleConfirmationClose = async ({ newItems, modifiedExisting }) => {
        setShowConfirmation(false);
        if (newItems.length === 0 && modifiedExisting.length === 0) {
            return;
        }
        let updateSuccess = false;
        let saveSuccess = false;
        if (modifiedExisting.length > 0) {
            try {
                const response = await fetch("http://127.0.0.1:5000/wardrobe/update-classifications", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(modifiedExisting),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                updateSuccess = true;
                const updatedWardrobe = [...wardrobeItems];
                modifiedExisting.forEach(modifiedItem => {
                    const index = updatedWardrobe.findIndex(item => item.image === modifiedItem.image);
                    if (index !== -1) {
                        updatedWardrobe[index] = modifiedItem;
                    }
                });
                setWardrobeItems(updatedWardrobe);
            } catch (error) {
                console.error("Error updating classifications: ", error);
            }
        }
        if (newItems.length > 0) {
            try {
                const response = await fetch("http://127.0.0.1:5000/wardrobe/save-clothing-items", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newItems),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                saveSuccess = true;
                const updatedWardrobe = [...wardrobeItems, ...newItems];
                setWardrobeItems(updatedWardrobe);
            } catch (error) {
                console.error("Error saving items: ", error);
            }
        }
        if (updateSuccess || saveSuccess) {
            await fetchWardrobe();
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
        });
    };

    return (
        <div className="app-container">
            {/* Main Section */}
            <div className="main-content">
                <div className="sidebar">
                    <h1>Welcome to RunwAI</h1>
                    <h2>
                        An AI-powered styling assistant that curates outfit suggestions
                        based on your uploaded wardrobe.
                    </h2>
                    <label className="upload-btn">
                        <Icons.Upload className="upload"/> Upload
                        <input type="file" multiple onChange={handleUpload} hidden/>
                    </label>
                    <button className="generate-btn" onClick={handleGenerate}>
                        <Icons.Generate className="generate"/> Generate
                    </button>
                </div>

                {showCategories && (
                    <div className="gallery-container">
                        <h1>My Wardrobe</h1>

                        <div className="gallery">
                            {/*arrows are here and invis as temp solution for spacing*/}
                            <Icons.LeftArrow
                                className={`arrow hidden`}
                            />

                            <div className="image-grid">
                                {[
                                    {icon: <Icons.Shirt className="category-icon"/>, label: "Tops"},
                                    {icon: <Icons.Shorts className="category-icon"/>, label: "Bottoms"},
                                    {icon: <Icons.Shoe className="category-icon"/>, label: "Shoes"},
                                    {icon: <Icons.Jacket className="category-icon"/>, label: "Outerwear"},
                                    {icon: <Icons.Dress className="category-icon"/>, label: "Dress"},
                                    {icon: <Icons.Clothing className="category-icon"/>, label: "All"},
                                ].map(({icon, label}) => (
                                    <div
                                        key={label}
                                        className="category-box"
                                        onClick={() => {
                                            setSelectedCategory(label);
                                            setShowGallery(true);
                                            setShowCategories(false);
                                        }}
                                    >
                                        {icon}
                                        <p className="category-label">{label}</p>
                                    </div>
                                ))}
                            </div>

                            <Icons.RightArrow
                                className={`arrow hidden`}
                            />

                        </div>
                    </div>
                )}


                {showGallery && (
                    <Gallery
                        wardrobeItems={wardrobeItems}
                        selectedCategory={selectedCategory}
                        onClose={handleGalleryClose}
                        onImageClick={(imageData) => {
                            openConfirmation({
                                newItems: [],
                                existingItems: [imageData],
                            });
                        }}
                    />
                )}
            </div>

            {/* Show confirmation popup */}
            {showConfirmation && (
                <Confirmation
                    existingClassifications={confirmationData.existingClassifications}
                    newClassifications={confirmationData.newClassifications}
                    onClose={handleConfirmationClose}
                />
            )}

            {/* "generating" popup */}
            {isAnalyzing && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <Icons.Loading className="spinner"/>
                        <p id="popup-text">Analyzing clothing items...</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomePage;
