import torch
import clip

#Load the model
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device = device)

def classify(image_file):
    # Load and preprocess the image

    image = preprocess(image_file).unsqueeze(0).to(device)

    # Encode image
    with torch.no_grad():
        image_features = model.encode_image(image)
        image_features /= image_features.norm(dim=1, keepdim=True) # Normalize

    # Results dictionary
    results = {}

    # Verify all category prompts and labels have matching lengths
    for key in category_labels:
        if key == "sub_category":
            for sub_key in category_labels[key]:
                if len(category_prompts[key][sub_key]) != len(category_labels[key][sub_key]):
                    raise ValueError(f"Mismatch in '{key}.{sub_key}': {len(category_prompts[key][sub_key])} prompts vs {len(category_labels[key][sub_key])} labels")
        else: 
            if len(category_prompts[key]) != len(category_labels[key]):
                raise ValueError(f"Mismatch in '{key}': {len(category_prompts[key])} prompts vs {len(category_labels[key])} labels")

    # Separately classify a main and sub_category since they are dependant on each other
    results["main_category"] = compute_similarity(image_features, category_labels["main_category"], category_prompts["main_category"])
    results["sub_category"] = compute_similarity(
        image_features, 
        category_labels["sub_category"][results["main_category"]], 
        category_prompts["sub_category"][results["main_category"]]
        )

    # Loop through the rest of the categories in the dictionary and perform the classification
    for key in category_labels.keys():
        if key != "main_category" and key != "sub_category":
            results[key] = compute_similarity(image_features, category_labels[key], category_prompts[key])

    return results

def compute_similarity(image_features, labels, prompts):

    # Make sure that labels and prompts are the same length
    if len(prompts) != len(labels):
        raise ValueError("Prompts and labels lists must be of the same length")
    
    # Tokenize prompts
    text_inputs = clip.tokenize(prompts).to(device)

    # Encode text
    with torch.no_grad():
        text_features = model.encode_text(text_inputs)

    # Compute similiraty 
    text_features /= text_features.norm(dim=1, keepdim=True) # Normalize
    similarity = (image_features @ text_features.T).squeeze(0) # Compute cosine similarity

    # Get the best match 
    best_match = similarity.argmax().item()

    return labels[best_match]

# ===== Category Dictionaries =====

# Dictionary of category labels
category_labels = {
        "main_category": ["top", "bottom", "footwear", "outerwear", "dress"], 
        "sub_category": {
            "top": [
                "t-shirt", "button-up shirt", "blouse", "polo shirt", "tank top",
                "sweater", "sweatshirt", "cardigan", "turtleneck", "crop top",
                "tunic", "athletic top", "henley", "flannel shirt", "printed shirt",
                "jacket"
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
            ]
        },
        "style": [
            "casual", "formal", "business", "athletic", "streetwear",
            "bohemian", "vintage", "preppy", "minimalist", "luxury"
        ],
        "silhouette": [
            "fitted", "relaxed", "oversized", "A-line", "boxy",
            "draped", "tailored", "flared", "straight", "voluminous"
        ],
        "color": [
            "red", "blue", "black", "white", "green", "yellow", 
            "purple", "pink", "orange", "brown", "gray", "navy", "beige", "cream"
        ],
        "pattern": [
            "solid", "striped", "plaid", "floral", "polka dot", "graphic", "animal print",
            "geometric", "abstract", "camouflage", "tie-dye", "checkered"
            ],
        "season": ["spring", "summer", "fall", "winter"],
        "occasion": [
            "casual", "work", "formal", "athletic", "outdoor", 
            "lounge", "party", "special event", "beach", "travel"
            ]
    }

# Dictionary of category prompts
category_prompts = {
        "main_category": [
            "a photograph of clothing worn on the upper body, like a shirt, jacket, or a dress",
            "a photograph of clothing worn on the lower body, like pants, jeans, shorts, or a skirt",
            "a photograph of footwear worn on feet, like shoes or boots",
            "a photograph of an outerwear garment like a jacket or coat",
            "a photograph of a dress or gown worn as a single piece"
        ],
        "sub_category": {
            "top": [
                "a t-shirt", "a button-up shirt", "a blouse", "a polo shirt", "a tank top",
                "a sweater", "a sweatshirt", "a cardigan", "a turtleneck", "a crop top",
                "a tunic", "an athletic top", "a henley shirt", "a flannel shirt", "a printed shirt",
                "a jacket"
            ],
            "bottom": [
                "a pair of blue denim jeans", "a pair of dress slacks", "a pair of chino pants",
                "a pair of shorts", "a skirt", "a pair of leggings", "a pair of sweatpants",
                "a pair of cargo pants", "a pair of athletic shorts", "a pair of bermuda shorts",
                "a pair of culottes", "a pair of capri pants", "a pair of palazzo pants", 
                "a pair of cargo shorts", "a pair of denim shorts"
            ],
            "footwear": [
                "a pair of sneakers", "a pair of dress shoes", "a pair of loafers", "a pair of boots",
                "a pair of sandals", "a pair of high heels", "a pair of flat shoes", "a pair of slip-on shoes",
                "a pair of ankle boots", "a pair of running shoes", "a pair of hiking shoes",
                "a pair of mules", "a pair of espadrilles", "a pair of boat shoes", "a pair of flip-flops"
            ],
            "outerwear": [
                "a jacket with a structured design for casual or formal wear",
                "a blazer with a tailored fit typically worn over formal clothes",
                "a coat that extends below the hips for cold weather protection",
                "a raincoat made of waterproof material for wet weather",
                "a windbreaker made of lightweight material to block wind",
                "a denim jacket made from blue jean material",
                "a leather jacket made from animal hide or synthetic leather",
                "a bomber jacket with a puffy appearance and elastic waistband",
                "a puffer jacket with quilted sections filled with insulation"
            ],
            "dress": [
                "a casual dress designed for everyday wear",
                "a formal dress designed for special occasions",
                "a maxi dress that extends to the ankles",
                "a mini dress with a hemline above the knees",
                "a sundress designed for warm weather with thin straps",
                "a cocktail dress for semi-formal events",
                "an evening gown for formal events that extends to the floor",
                "a shift dress with a straight cut that hangs from the shoulders"
            ]
        },
        "style": [
            "clothing with a casual everyday style",
            "clothing with a formal elegant style",
            "clothing with a professional business style",
            "clothing with an athletic sporty style",
            "clothing with an urban streetwear style",
            "clothing with a bohemian free-spirited style",
            "clothing with a vintage retro style",
            "clothing with a preppy collegiate style",
            "clothing with a minimalist clean style",
            "clothing with a high-end luxury style"
        ],
        "silhouette": [
            "clothing with a fitted silhouette", 
            "clothing with a relaxed silhouette", 
            "clothing with an oversized silhouette",
            "clothing with an A-line silhouette", 
            "clothing with a boxy silhouette",
            "clothing with a draped silhouette", 
            "clothing with a tailored silhouette", 
            "clothing with a flared silhouette", 
            "clothing with a straight silhouette", 
            "clothing with a voluminous silhouette"
        ],
        "color": [
            "clothing that is red in color", 
            "clothing that is blue in color", 
            "clothing that is black in color", 
            "clothing that is white in color", 
            "clothing that is green in color", 
            "clothing that is yellow in color",
            "clothing that is purple in color",
            "clothing that is pink in color",
            "clothing that is orange in color",
            "clothing that is brown in color",
            "clothing that is gray in color",
            "clothing that is navy in color",
            "clothing that is beige in color",
            "clothing that is cream in color"
        ],
        "pattern": [
            "clothing with a solid color pattern and no designs or prints",
            "clothing with parallel lines or stripes of different colors",
            "clothing with a tartan or plaid pattern with intersecting lines forming squares",
            "clothing decorated with flower or botanical motifs and designs",
            "clothing covered with dots or small circular spots repeated across the fabric",
            "clothing featuring logos, text, images, or artistic designs printed on the fabric",
            "clothing with patterns mimicking animal skins like leopard spots or zebra stripes",
            "clothing with a geometric pattern with shapes like triangles, circles, or squares",
            "clothing with an abstract pattern featuring non-representational designs",
            "clothing with a camouflage pattern designed to blend with surroundings",
            "clothing with a tie-dye pattern created by twisting and dyeing fabric",
            "clothing with a checkered pattern featuring alternating colored squares"
        ],
        "season":[
            "clothing typically worn in spring", 
            "clothing typically worn in summer", 
            "clothing typically worn in fall", 
            "clothing typically worn in winter"
        ],
        "occasion": [
            "clothing for casual occasions", 
            "clothing for work or business settings", 
            "clothing for formal events", 
            "clothing for athletic activities", 
            "clothing for outdoor activities", 
            "clothing for lounging at home", 
            "clothing for parties", 
            "clothing for special events",
            "clothing for going to the beach",
            "clothing for travel"
        ],
    }