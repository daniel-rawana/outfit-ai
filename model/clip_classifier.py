import os
import certifi
import torch
import clip
from PIL import Image 

def classify(image_path):
    
    # Set the SSL certificate path
    os.environ['SSL_CERT_FILE'] = certifi.where()

    # Load the model
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model, preprocess = clip.load("ViT-B/32", device = device)

    # Load and preprocess the image
    image = preprocess(Image.open(image_path)).unsqueeze(0).to(device)

    # Define main category (Top, bottom, footwear)
    main_categories = ["top", "bottom", "footwear"]

    # Tokenize main category names 
    text_inputs = clip.tokenize(main_categories).to(device)

    # Encode image and text
    with torch.no_grad():
        image_features = model.encode_image(image)
        text_features = model.encode_text(text_inputs)

    # Compute similarity
    image_features /= image_features.norm(dim=-1, keepdim=True)
    text_features /= text_features.norm(dim=-1, keepdim=True)
    similarity = (image_features @ text_features.T).squeeze(0) # Compute cosine similarity 

    # Get the best match
    best_match = similarity.argmax().item()
    main_category = main_categories[best_match]

    # Define subcategories 
    if main_category == "top":
        sub_categories = ["t-shirt",
        "button-up shirt",
        "blouse",
        "polo shirt",
        "tank top",
        "sweater",
        "sweatshirt",
        "cardigan",
        "turtleneck",
        "crop top",
        "tunic",
        "athletic top",
        "henley",
        "flannel shirt",
        "printed shirt",
        "jacket"]

    elif main_category == "bottom":
        sub_categories = ["jeans",
        "slacks",
        "chinos",
        "shorts",
        "skirt",
        "leggings",
        "sweatpants",
        "cargo pants",
        "athletic shorts",
        "bermuda shorts",
        "culottes",
        "capri pants",
        "palazzo pants",
        "cargo shorts",
        "denim shorts"]

    elif main_category == "footwear":
        sub_categories = ["sneakers",
        "dress shoes",
        "loafers",
        "boots",
        "sandals",
        "heels",
        "flats",
        "slip-ons",
        "ankle boots",
        "running shoes",
        "hiking shoes",
        "mules",
        "espadrilles",
        "boat shoes",
        "flip-flops"]

    # Tokenize the subcategories
    text_inputs = clip.tokenize(sub_categories).to(device)

    # Encode sub categories
    with torch.no_grad():
        text_features = model.encode_text(text_inputs)

    # Compute similarity of sub categories 
    text_features /= text_features.norm(dim=1, keepdim=True)
    similarity = (image_features @ text_features.T).squeeze(0) # Compute cosine similarity 

    # Get the best match
    best_match = similarity.argmax().item()
    sub_category = sub_categories[best_match]

    # Define colors
    colors = ["red", "blue", "black", "white", "green", "yellow"]

    # Tokenize colors 
    text_inputs = clip.tokenize(colors).to(device)

    # Encode colors 
    with torch.no_grad():
        text_features = model.encode_text(text_inputs)

    # Compute similiraty of colors 
    text_features /= text_features.norm(dim=1, keepdim=True)
    similarity = (image_features @ text_features.T).squeeze(0) # Compute cosine similarity

    # Get the best match 
    best_match = similarity.argmax().item()
    color = colors[best_match]

    # Define seasonal setting
    seasons = ["Spring", "Summer", "Fall", "Winter"]

    # Tokenize seasons
    text_inputs = clip.tokenize(seasons).to(device)

    # Encode seasons
    with torch.no_grad():
        text_features = model.encode_text(text_inputs)

    # Compute similiraty of colors 
    text_features /= text_features.norm(dim=1, keepdim=True)
    similarity = (image_features @ text_features.T).squeeze(0) # Compute cosine similarity

    # Get the best match 
    best_match = similarity.argmax().item()
    season = seasons[best_match]

    prediction = [main_category, sub_category, color, season]

    return prediction

print(classify("/Users/eduardogoncalvez/Desktop/jacket.jpg"))