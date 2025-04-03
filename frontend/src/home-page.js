import "./styling/App.css";
import React, {useState, useEffect, useRef} from "react";
import {Icons} from "./icons";
import {useNavigate} from "react-router-dom";
import Confirmation from "./confirmation";

function HomePage() {
    const [wardrobeItems, setWardrobeItems] = useState([]); // existing wardrobe (items + classifications)
    const [uploadedImages, setUploadedImages] = useState([]); // new images uploaded
    const [previewImages, setPreviewImages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const imagesPerPage = 9; // 3x3 grid, 9 images per page
    const navigate = useNavigate();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationData, setConfirmationData] = useState({existingClassifications: [], newClassifications: []});
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
            const response = await fetch("http://127.0.0.1:5000/wardrobe");
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

                // Convert base64 to object URLs for display
                const previewUrls = wardrobe.map(item => `data:image/jpeg;base64,${item.image}`);
                setPreviewImages(previewUrls);
            }
        } catch (error) {
            console.error("Error fetching wardrobe: ", error);
        }
    };

    const uploadImages = async () => {
        if (uploadedImages.length === 0) return;

        setIsAnalyzing(true); // Show analyzing popup

        const base64Images = await Promise.all(
            uploadedImages.map((image) => convertToBase64(image))
        );

        try {
            const response = await fetch("http://127.0.0.1:5000/wardrobe/classify-clothing", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({images: base64Images}),
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

    const handleUpload = (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        setUploadedImages(prev => [...prev, ...files])

        // Generate preview URLs for display
        const previewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...previewUrls]);
    };

    const handleEdit = () => {
        if (wardrobeItems.length > 0) {
            setConfirmationData({
                existingClassifications: wardrobeItems,
                newClassifications: [] });
            setShowConfirmation(true);
        }
    }

    const handleConfirmationClose = async ({newItems, modifiedExisting}) => {
        setShowConfirmation(false);

        // only send data if there are new or modified items
        if (newItems.length === 0 && modifiedExisting.length === 0) {
            return;
        }

        let updateSuccess = false;
        let saveSuccess = false;

        // update existing items
        if (modifiedExisting.length > 0) {
            try {
                const response = await fetch("http://127.0.0.1:5000/wardrobe/update-classifications", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(modifiedExisting),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                updateSuccess = true;

                // temporary way to update wardrobeItems while DB connections get set up
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

        // add new items to database
        if (newItems.length > 0) {
            try {
                const response = await fetch("http://127.0.0.1:5000/wardrobe/save-clothing-items", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newItems),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                saveSuccess = true;

                // temporary way to update wardrobeItems while DB connections get set up
                const updatedWardrobe = [...wardrobeItems, ...newItems];
                setWardrobeItems(updatedWardrobe);
            } catch (error) {
                console.error("Error saving items: ", error);
            }
        }

        if (updateSuccess || saveSuccess) {
            // get wardrobe again to ensure UI is synchronized with wardrobe in DB
            //await fetchWardrobe();
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

    // Calculate the images to display for the current page
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
                    <button className="edit-btn" onClick={handleEdit}>
                        <Icons.Edit className="edit"/> Edit
                    </button>
                    <button className="generate-btn" onClick={handleGenerate}>
                        <Icons.Generate className="generate"/> Generate
                    </button>
                </div>

                {/* Image Grid with Arrows */}
                <div className="image-gallery">
                    <Icons.LeftArrow
                        className={`arrow ${currentPage === 0 ? "hidden" : ""}`}
                        onClick={currentPage > 0 ? handlePrevPage : null}
                    />

                    {previewImages.length === 0 ? (
                        <div className="gallery-placeholder">No images uploaded yet.</div>
                    ) : (
                        <div className="image-grid">
                            {displayedImages.map((src, index) => (
                                <div key={index} className="image-container">
                                    <img src={src} alt={`Item ${index}`}/>
                                </div>
                            ))}
                            {/* Fill empty slots with placeholders */}
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