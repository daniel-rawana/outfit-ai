def generate_ranked_outfits(wardrobe, user_preferences, limit=3):
    categories = {
        "top": [],
        "bottom": [],
        "footwear": [],
        "outerwear": [],
        "dress": []
    }
    
    for clothing in wardrobe:
        category = clothing["main_category"]
        if category in categories:
            categories[category].append(clothing)
    
    tops = categories["top"]
    bottoms = categories["bottom"]
    footwear = categories["footwear"]
    outerwear = categories["outerwear"]
    dresses = categories["dress"]

    # Check if there is enough items
    if not tops or not bottoms or not footwear:
        return []
    
    # Generate all possible outfit 
    possible_outfits = []

    for top in tops:
        for bottom in bottoms:
            for shoe in footwear:
                outfit = {
                    "top": top,
                    "bootom": bottom,
                    "footwear": shoe,
                    "score": 0
                }

                outfit_score = calculate_outfit_score(outfit, user_preferences)
                outfit["score"] = outfit_score

                possible_outfits.append(outfit)

    ranked_outfits = sorted(possible_outfits, key=lambda x:["score"], reverse=True)

    return ranked_outfits[:limit]

def calculate_outfit_score(outfit, user_preferences):
    score = 0

    items = [outfit["top"], outfit["bottom"], outfit["footwear"]]

    weather_score = calculate_weather_score(items, user_preferences["weather"])
    score += weather_score * 30

    occasion_score = calculate_occasion_score(items, user_preferences["occasion"])
    score += occasion_score * 25

    color_score = calculate_color_compatibility(items)
    score += color_score * 20

    pattern_score = calculate_pattern_compatibility(items)
    score += pattern_score * 15

    style_score = calculate_style_consistency(items)
    score += style_score * 10 

    return score

def filter_by_weather(wardrobe, weather):
    # Map weather to season
    weather_to_season = {
        "hot": "summer",
        "warm": "spring",
        "cool": "fall",
        "cold": "winter",
        "rainy": "fall"
    }

    # Get target season based on current weather, if the key doesn't exist, it assings weather as default 
    target_season = weather_to_season.get(weather, weather)

    # Return filtered list 
    return [item for item in wardrobe if item["season"] == target_season]

def filter_by_occasion(wardrobe, occasion):
    """
    Occasion should be gathered as an input from the suser when they ask to generate an outfit

    Since occasion might be subjective, this function overlaps certain occasions according to their compatibility 

    This function returns a list with filtered clothing items according to the occasion 
    """

    compatible_occasions = {
        "casual": ["casual", "lounge", "outdoor"],
        "work": ["work", "formal", "special_event"],
        "formal": ["formal", "work", "special_event"],
        "athletic": ["athletic", "outdoor"],
        "outdoor": ["outdoor", "athletic", "casual"],
        "lounge": ["lounge", "casual"],
        "party": ["party", "casual", "special_event"],
        "special_event": ["special_event", "formal", "party"]
    }

    # Get list of compatibles occasions with the occasion requested from the user
    target_occasions = compatible_occasions[occasion]

    # Return filtered list
    return [item for item in wardrobe if item["occasion"] in target_occasions]

def filter_wardrobe(wardrobe, weather, occasion):
    """
    This function combines both filters and classifies the wardrobe by 
    the main_category of each clothing piece 
    """

    # Result dictionary of lists divided by main category 
    filtered_wardrobe = {
        "top": [],
        "bottom": [],
        "footwear": []
    }
    
    # Classify clothing items by their main category (top, bottom, footwear)
    for item in filter_by_occasion(filter_by_weather(wardrobe, weather), occasion):
        filtered_wardrobe[item["main_category"]].append(item)
    
    return filtered_wardrobe