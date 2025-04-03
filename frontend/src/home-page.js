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
    const [confirmationData, setConfirmationData] = useState({ classifications: [] });
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
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
        fetchWardrobe();
    }, []);

    useEffect(() => {
        if (uploadedImages.length > 0) {
            uploadImages();
        }
    }, [uploadedImages]);

    const uploadImages = async () => {
        if (uploadedImages.length === 0) return;

        setIsAnalyzing(true); // Show analyzing popup

        const base64Images = await Promise.all(
            uploadedImages.map((image) => convertToBase64(image))
        );

        try {
            const response = await fetch("http://127.0.0.1:5000/wardrobe/items", {
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

            const classifications = result.message;

            // update wardrobe items and then open confirmation popup with updated data
            setWardrobeItems((prev) => {
                const updatedWardrobe = [...prev, ...classifications];
                setConfirmationData({classifications: updatedWardrobe});
                return updatedWardrobe;
            });

            setUploadedImages([]);
            setIsAnalyzing(false);
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
            setConfirmationData({classifications: wardrobeItems});
            setShowConfirmation(true);
        }
    }

    const handleConfirmationClose = async (updatedClassifications = null) => {
        setShowConfirmation(false);

        // discard changes if user clicked cancel
        if (!updatedClassifications) { return; }

        // need to update to only send updated selections
        try {
            const response = await fetch("http://127.0.0.1:5000/wardrobe/update-classifications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedClassifications),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setWardrobeItems(updatedClassifications);
        } catch (error) {
            console.error("Error updating classifications: ", error);
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
                    wardrobeImages={confirmationData.wardrobeImages}
                    classifications={confirmationData.classifications}
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