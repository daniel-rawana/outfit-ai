def generate_ranked_outfits(wardrobe, user_preferences, limit=3):
    categories = {
        "top": [],
        "bottom": [],
        "footwear": [],
        "outerwear": [],
        "dress": []
    }
    
    for clothing in wardrobe:
        category = clothing.main_category
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
    
    # Score individual items based on weather and occasion 
    scored_tops = score_individual_items(tops, user_preferences)
    scored_bottoms = score_individual_items(bottoms, user_preferences)
    scored_shoes = score_individual_items(footwear, user_preferences)

    # Get top items from each category 
    top_limit = min(limit, len(tops))
    bottom_limit = min(limit, len(bottoms))
    shoe_limit = min(limit, len(footwear))

    best_tops = [item for item, _ in scored_tops[:top_limit]]
    best_bottoms = [item for item, _ in scored_bottoms[:bottom_limit]]
    best_shoes = [item for item, _ in scored_shoes[:shoe_limit]]

    # Generate outfits using only these top items
    possible_outfits = []

    for top in best_tops:
        for bottom in best_bottoms:

            best_shoe = find_best_shoe(top, bottom, best_shoes)

            outfit = {
                "top": top,
                "bottom": bottom,
                "footwear": best_shoe,
                "score": 0
            }

            outfit_score = calculate_outfit_score(outfit, user_preferences)
            outfit["score"] = outfit_score

            possible_outfits.append(outfit)
    
    # Sort outfits by score
    ranked_outfits = sorted(possible_outfits, key=lambda x:["score"], reverse=True)

    # Return top outfits
    return ranked_outfits[:limit]

def score_individual_items(items, user_preferences):
    scored_items = []

    for item in items:
        # Start with base score
        score = 0

        # Weather/season score (0-50 points)
        weather_score = match_weather(item, user_preferences["weather"])
        score += weather_score

        # Occasion score (0-50 points)
        occasion_score = match_occasion(item, user_preferences["occasion"])
        score += occasion_score

        scored_items.append((item, score))
    
    return sorted(scored_items, key=lambda x: x[1], reverse=True)

def match_weather(item, weather):
    weather_to_season = {
        "hot": "summer",
        "warm": "spring",
        "cool": "fall",
        "cold": "winter",
        "rainy": "fall"  
    }
    
    target_season = weather_to_season.get(weather, weather)
    
    # Direct match
    if item.season == target_season:
        return 1.0
    
    # Seasonal adjacency (spring is adjacent to summer and winter, etc.)
    seasonal_adjacency = {
        "spring": ["summer", "winter"],
        "summer": ["spring", "fall"],
        "fall": ["summer", "winter"],
        "winter": ["fall", "spring"]
    }
    
    if target_season in seasonal_adjacency and item.season in seasonal_adjacency[target_season]:
        return 0.7
        
    # Not suitable
    return 0.3

def match_occasion(item, occasion):
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
        
    # Direct match
    if item.occasion == occasion:
        return 1.0
    
    # Find secondary compatibility
    if item.occasion in compatible_occasions.get(occasion, [occasion]):
        return 0.7
    
    # Not suitable
    return 0.3

def find_best_shoe(top, bottom, shoes):
    best_score = -1
    best_shoe = shoes[0] if shoes else None

    for shoe in shoes: 
        # Calculate color compatibility 
        color_score = calculate_color_compatibility(top, bottom, shoe)

        # Calculate pattern compatibility 
        pattern_score = calculate_pattern_compatibility(top, bottom, shoe)

        # Weigted average score
        score = (color_score * 0.7) + (pattern_score * 0.3)

        if score > best_score:
            best_score = score
            best_shoe = shoe 

    return best_shoe

def calculate_outfit_score(outfit, user_preferences):
    score = 0

    # Get items
    top = outfit["top"]
    bottom = outfit["bottom"]
    footwear = outfit["footwear"]

    # Weather appropriateness (0-30 points)
    weather_score = calculate_weather_score([top, bottom, footwear], user_preferences["weather"])
    score += weather_score * 30
    
    # Occasion appropriateness (0-25 points)
    occasion_score = calculate_occasion_score([top, bottom, footwear], user_preferences["occasion"])
    score += occasion_score * 25
    
    # Color compatibility (0-20 points)
    color_score = calculate_color_compatibility(top, bottom, footwear)
    score += color_score * 20
    
    # Pattern compatibility (0-15 points)
    pattern_score = calculate_pattern_compatibility(top, bottom, footwear)
    score += pattern_score * 15
    
    # Style consistency (0-10 points)
    style_score = calculate_style_consistency(top, bottom, footwear)
    score += style_score * 10
    
    return score

def calculate_weather_score(items, weather):
    weather_to_season = {
        "hot": "summer",
        "warm": "spring",
        "cool": "fall",
        "cold": "winter",
        "rainy": "fall"  
    }
    
    target_season = weather_to_season.get(weather, weather)
    
    # Calculate percentage of items appropriate for the weather
    matches = sum(1 for item in items if item["season"] == target_season)
    return matches / len(items)

def calculate_occasion_score(items, occasion):
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
    
    target_occasions = compatible_occasions.get(occasion, [occasion])
    
    # Calculate percentage of items appropriate for the occasion
    matches = sum(1 for item in items if item["occasion"] in target_occasions)
    return matches / len(items)

#FIXME
def calculate_color_compatibility(top, bottom, footwear):
    pass

#FIXME
def calculate_pattern_compatibility(top, bottom, footwear):
    pass

#FIXME
def calculate_style_consistency(top, bottom, footwear):
    pass