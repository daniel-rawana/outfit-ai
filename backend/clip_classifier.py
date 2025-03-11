import torch
import clip
import io
from PIL import Image

#Load the model
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device = device)

def classify(image):
    # Load and preprocess the image
    image = preprocess(Image.open(io.BytesIO(image.read()))).unsqueeze(0).to(device)

    # Encode image
    with torch.no_grad():
        image_features = model.encode_image(image)
    
    # Dictionary of categories with their possible values
    categories = {
        "main_category": ["top", "bottom", "footwear"],
        "sub_category": {
            "top": [
                "t-shirt", "button-up shirt", "blouse", "polo shirt", "tank top",
                "sweater", "sweatshirt", "cardigan", "turtleneck", "crop top",
                "tunic", "athletic top", "henley", "flannel shirt", "printed shirt",
                "jacket", "dress"
            ],
            "bottom": [
                "jeans", "slacks", "chinos", "shorts", "skirt",
                "leggings", "sweatpants", "cargo pants", "athletic shorts", "bermuda shorts",
                "culottes", "capri pants", "palazzo pants", "cargo shorts", "denim shorts"
            ],
            "footwear": [
                "sneakers", "dress shoes", "loafers", "boots", "sandals",
                "heels", "flats", "slip-ons", "ankle boots", "running shoes",
                "hiking shoes", "mules", "espadrilles", "boat shoes", "flip-flops"
            ]
        },
        "color": ["red", "blue", "black", "white", "green", "yellow"],
        "pattern": ["solid", "striped", "plaid", "floral", "polka_dot", "graphic", "animal"],
        "season": ["spring", "summer", "fall", "winter"],
        "occasion": ["casual", "work", "formal", "athletic", "outdoor", "lounge", "party", "special_event"]
    }

    # Results dictionary
    results = {}

    # Separately classify a main and sub_category since they are dependant on each other
    results["main_category"] = compute_similarity(categories["main_category"], image_features)
    results["sub_category"] = compute_similarity(categories["sub_category"][results["main_category"]], image_features)

    # Loop through the rest of the categories in the dictionary and perform the classification
    for key in categories.keys():
        if key != "main_category" and key != "sub_category":
            results[key] = compute_similarity(categories[key], image_features)

    return results

def compute_similarity(categories, image_features):
    # Tokenize categories
    text_inputs = clip.tokenize(categories).to(device)

    # Encode
    with torch.no_grad():
        text_features = model.encode_text(text_inputs)

    # Compute similiraty 
    text_features /= text_features.norm(dim=1, keepdim=True)
    similarity = (image_features @ text_features.T).squeeze(0) # Compute cosine similarity

    # Get the best match 
    best_match = similarity.argmax().item()

    return categories[best_match]