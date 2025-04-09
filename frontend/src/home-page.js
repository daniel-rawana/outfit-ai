import "./styling/App.css";
import React, { useState, useEffect } from "react";
import { Icons } from "./icons";
import { useNavigate } from "react-router-dom";
import Confirmation from "./confirmation";

function HomePage() {
    const [wardrobeItems, setWardrobeItems] = useState([]);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const imagesPerPage = 6; // Adjusted for potentially better centering layout
    const navigate = useNavigate();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationData, setConfirmationData] = useState({ existingClassifications: [], newClassifications: [] });
    const [isAnalyzing, setIsAnalyzing] = useState(false);

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
                const previewUrls = wardrobe.map(item => item.image);
                setPreviewImages(previewUrls);
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
            setConfirmationData({
                existingClassifications: wardrobeItems,
                newClassifications: newClassifications
            });
            setShowConfirmation(true);
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
        const previewUrls = newImageFiles.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...previewUrls]);
    };

    const handleEdit = () => {
        if (wardrobeItems.length > 0) {
            setConfirmationData({
                existingClassifications: wardrobeItems,
                newClassifications: []
            });
            setShowConfirmation(true);
        } else {
            alert("Please upload some wardrobe items first.");
        }
    }

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
            // await fetchWardrobe();
        }
    };

    const totalPages = Math.ceil(previewImages.length / imagesPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const displayedImages = previewImages.slice(
        currentPage * imagesPerPage,
        (currentPage + 1) * imagesPerPage
    );

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
            <div className="main-content-centered">
                <h1 className="my-wardrobe-heading">My Wardrobe</h1>
                <div className="image-gallery">
                    <Icons.LeftArrow
                        className={`arrow ${currentPage === 0 ? "hidden" : ""}`}
                        onClick={currentPage > 0 ? handlePrevPage : null}
                    />
                    {previewImages.length === 0 ? (
                        <div className="gallery-placeholder">No images uploaded yet.</div>
                    ) : (
                        <div className="image-grid centered-grid">
                            {displayedImages.map((src, index) => (
                                <div key={index} className="image-container">
                                    <img src={src} alt={`Item ${index}`} />
                                </div>
                            ))}
                            {Array.from({
                                length: imagesPerPage - displayedImages.length,
                            }).map((_, index) => (
                                <div key={`placeholder-${index}`} className="image-placeholder"></div>
                            ))}
                        </div>
                    )}
                    <Icons.RightArrow
                        className={`arrow ${currentPage >= totalPages - 1 ? "hidden" : ""}`}
                        onClick={currentPage < totalPages - 1 ? handleNextPage : null}
                    />
                </div>
                <div className="home-page-actions">
                    <h1>Welcome to RunwAI</h1>
                    <h2>
                        An AI-powered styling assistant that curates outfit suggestions
                        based on your uploaded wardrobe.
                    </h2>
                    <label className="upload-btn">
                        <Icons.Upload className="upload" /> Upload
                        <input type="file" multiple onChange={handleUpload} hidden />
                    </label>
                    <button className="edit-btn" onClick={handleEdit}>
                        <Icons.Edit className="edit" /> Edit
                    </button>
                    <button className="generate-btn" onClick={handleGenerate}>
                        <Icons.Generate className="generate" /> Generate
                    </button>
                </div>
            </div>
            {showConfirmation && (
                <Confirmation
                    existingClassifications={confirmationData.existingClassifications}
                    newClassifications={confirmationData.newClassifications}
                    onClose={handleConfirmationClose}
                />
            )}
            {isAnalyzing && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <Icons.Loading className="spinner" />
                        <p id="popup-text">Analyzing clothing items...</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomePage;
