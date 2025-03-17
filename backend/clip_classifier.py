import torch
import clip
from PIL import Image
import os

# global variables for model and device
model = None
preprocess = None
device = "cuda" if torch.cuda.is_available() else "cpu"

def load_model():
    # load the clip model
    global model, preprocess
    model, preprocess = clip.load("ViT-B/32", device=device)
    return model, preprocess

def classify(image_path):
    # load and preprocess the image
    image = Image.open(image_path)
    image_input = preprocess(image).unsqueeze(0).to(device)
    
    # dictionary of categories with their possible values
    categories = {
        "main_category": ["top", "bottom", "footwear", "outerwear", "dress", "accessory"],
        "sub_category": {
            "top": [
                "t-shirt", "button-up shirt", "blouse", "polo shirt", "tank top",
                "sweater", "sweatshirt", "cardigan", "turtleneck", "crop top",
                "tunic", "athletic top", "henley", "flannel shirt", "printed shirt"
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
            ],
            "outerwear": [
                "jacket", "blazer", "coat", "raincoat", "windbreaker",
                "denim jacket", "leather jacket", "bomber jacket", "puffer jacket"
            ],
            "dress": [
                "casual dress", "formal dress", "maxi dress", "mini dress",
                "sundress", "cocktail dress", "evening gown", "shift dress"
            ],
            "accessory": [
                "necklace", "bracelet", "earrings", "ring", "belt",
                "scarf", "hat", "bag", "watch", "sunglasses"
            ]
        },
        "style": [
            "casual", "formal", "business", "athletic", "streetwear",
            "bohemian", "vintage", "preppy", "minimalist", "luxury"
        ],
        "color": [
            "black", "white", "red", "blue", "green", "yellow", "purple",
            "pink", "orange", "brown", "gray", "navy", "beige", "cream"
        ],
        "pattern": [
            "solid", "striped", "plaid", "floral", "polka dot", "animal print",
            "geometric", "abstract", "camouflage", "tie-dye", "checkered"
        ],
        "season": ["spring", "summer", "fall", "winter"],
        "occasion": [
            "casual", "work", "formal", "athletic", "outdoor",
            "lounge", "party", "special event", "beach", "travel"
        ]
    }
    
    # results dictionary
    results = {}
    
    # first classify main category
    main_cat_results = compute_similarity(categories["main_category"], image_input)
    results["main_category"] = main_cat_results
    
    # get the top main category
    top_main_category = main_cat_results[0]["category"]
    
    # then classify sub-category based on main category
    if top_main_category in categories["sub_category"]:
        results["sub_category"] = compute_similarity(categories["sub_category"][top_main_category], image_input)
    
    # classify other attributes
    for key in ["style", "color", "pattern", "season", "occasion"]:
        results[key] = compute_similarity(categories[key], image_input)
    
    return results

def compute_similarity(categories, image_input):
    # tokenize categories
    text_inputs = torch.cat([clip.tokenize(cat) for cat in categories]).to(device)
    
    # get features
    with torch.no_grad():
        text_features = model.encode_text(text_inputs)
        image_features = model.encode_image(image_input)
    
    # normalize features
    text_features /= text_features.norm(dim=1, keepdim=True)
    image_features /= image_features.norm(dim=1, keepdim=True)
    
    # calculate similarity
    similarity = (100.0 * image_features @ text_features.T).softmax(dim=-1)
    
    # get top 3 predictions
    values, indices = similarity[0].topk(3)
    
    # format results
    results = []
    for value, index in zip(values, indices):
        results.append({
            "category": categories[index],
            "confidence": float(value)
        })
    
    return results

# test section
if __name__ == "__main__":
    # load the model
    load_model()
    
    # test with a sample image
    test_image_path = "backend/images/22818.jpg" 
    if os.path.exists(test_image_path):
        results = classify(test_image_path)
        print("\npredictions:")
        for category, predictions in results.items():
            print(f"\n{category.title()}:")
            for pred in predictions:
                print(f"- {pred['category']}: {pred['confidence']:.2%}")
    else:
        print(f"please provide a valid image path. current path: {test_image_path}")