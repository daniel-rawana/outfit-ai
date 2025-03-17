def filter_by_weather(wardrobe, weather):
    """
    User's wardrobe parameter is supposed to be a list of dictionaries
    Where each dictionary corresponds to a clothing piece inside the user's wardrobe 

    Weather should be gathered as an input from the user when they ask to generate an outfit

    Currently, CLIP classifies images by their appropiate season,
    there is room for improvement since there might be a way to
    classify by weather using prompt engineering. 
    For now we will be mapping seasons to the appropiate weather

    This function returns a list with the filtered clothing items
    """

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