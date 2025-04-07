from clothing import Clothing
from wardrobe_manager import get_clothing_data

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
    ranked_outfits = sorted(possible_outfits, key=lambda x: x["score"], reverse=True)

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
    # style_score = calculate_style_consistency(top, bottom, footwear)
    # score += style_score * 10
    
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
    matches = sum(1 for item in items if item.season == target_season)
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
    matches = sum(1 for item in items if item.occasion in target_occasions)
    return matches / len(items)

def calculate_color_compatibility(top, bottom, footwear):
    # Get colors from each item
    top_color = top.color.lower()
    bottom_color = bottom.color.lower()
    footwear_color = footwear.color.lower()

    # Calculate pairwise compatibility scores
    top_bottom_score = color_pair_compatibility(top_color, bottom_color)
    bottom_footwear_score = color_pair_compatibility(bottom_color, footwear_color)
    top_footwear_score = color_pair_compatibility(top_color, footwear_color)

    # Weight the scores (top-bottom pairing is most important)
    weighted_score = (0.5 * top_bottom_score) + (0.25 * bottom_footwear_score) + (0.25 * top_footwear_score)

    return weighted_score

def color_pair_compatibility(color1, color2):
    # Handle missing or None values
    if not color1 or not color2:
        return 0.5 # Default moderate score
    
    # Check for same color (monochromatic)
    if color1 == color2:
        return 0.9 # High score for matching colors
    
    # Check for neutral colors (They go well with everything)
    neutrals = ["black", "white", "gray", "beige", "navy"]
    if color1 in neutrals or color2 in neutrals:
        return 0.85 # Good score for neutrals
    
    # Check for bad combinations 
    if is_bad_color_combination(color1, color2):
        return 0.2 # Low score for clashing colors
    
    # Default to decent compatibility if not specially bad
    return 0.7

def is_bad_color_combination(color1, color2):

    # Define clashing color pairs (based on high-contrast & unbalanced hues)
    clashing_pairs = {
        ("red", "green"), 
        ("orange", "blue"), 
        ("yellow", "purple"), 
        ("red", "pink"), 
        ("red", "orange"), 
        ("green", "purple"), 
        ("blue", "brown"), 
        ("yellow", "gray"), 
        ("purple", "brown")
    }

    # Ensure colors are in lowercase for consistency 
    color1, color2 = color1.lower(), color2.lower()

    # Check if colors are in the clashing pair set (both directions)
    if (color1, color2) in clashing_pairs or (color2, color1) in clashing_pairs:
        return True
    
    return False

def calculate_pattern_compatibility(top, bottom, footwear):
    patterns = [top.pattern, bottom.pattern, footwear.pattern]

    # Handle missing pattern data
    patterns = [p.lower() if p else "solid" for p in patterns]

    # Define pattern categories
    statement_patterns = ["floral", "animal", "graphic", "abstract", "camouflage", "tie-dye"]
    structured_patterns = ["striped", "plaid", "checkered", "geometric"]
    subtle_patterns = ["polka dot", "solid"]

    # Count patterns by category 
    statement_count = sum(1 for p in patterns if p in statement_patterns)
    structured_count = sum(1 for p in patterns if p in structured_patterns)

    # Rule 1: Only one statement pattern
    if statement_count > 1:
        return 0.3  # Multiple statement patterns clash
    
    # Rule 2: All solid is safe but boring
    if patterns.count("solid") == 3:
        return 0.8
    
    # Rule 3: Two structured patterns usually clash
    if structured_count > 1:
        return 0.5
    
    # Rule 4: One statement or structured + solids is good
    if (statement_count == 1 or structured_count == 1) and patterns.count("solid") >= 1:
        return 0.9
    
    # Default moderate score
    return 0.6


def calculate_style_consistency(top, bottom, footwear):

    # This function returns a score between 0 and 1
    # 0 means no style consistency, 1 means perfect style match

    # Extract style attributes from each item
    styles = [top.style, bottom.style, footwear.style]
    
    # Define style compatibility groups
    style_groups = {
        "casual": ["casual", "athletic"],
        "business": ["business", "formal"],
        "formal": ["formal", "business"],
        "athletic": ["athletic", "casual"]
    }
    
    # Count matching styles
    if all(style == styles[0] for style in styles):
        # Perfect match - all items have the same style
        return 1.0
    
    # Calculate pairwise compatibility
    compatibility_scores = []
    
    # Check top-bottom compatibility
    top_bottom_compatible = (bottom.style in style_groups.get(top.style, [top.style]))
    compatibility_scores.append(1.0 if top_bottom_compatible else 0.5)
    
    # Check bottom-footwear compatibility
    bottom_footwear_compatible = (footwear.style in style_groups.get(bottom.style, [bottom.style]))
    compatibility_scores.append(1.0 if bottom_footwear_compatible else 0.5)
    
    # Check top-footwear compatibility
    top_footwear_compatible = (footwear.style in style_groups.get(top.style, [top.style]))
    compatibility_scores.append(1.0 if top_footwear_compatible else 0.5)
    
    # Calculate weighted average (top-bottom compatibility is most important)
    weighted_score = (0.5 * compatibility_scores[0]) + (0.3 * compatibility_scores[1]) + (0.2 * compatibility_scores[2])
    
    # Complete style consistency across all items
    unique_styles = len(set(styles))
    if unique_styles == 1:
        weighted_score = min(1.0, weighted_score + 0.1)  # Bonus for perfect match
    elif unique_styles == 3:
        weighted_score = max(0.2, weighted_score - 0.1)  # Penalty for all different styles
    
    return weighted_score


def create_sample_wardrobe():
    wardrobe = []
    
    # Create 10 t-shirts
    t_shirts = [
        Clothing(image_data=None, main_category="top", sub_category="t-shirt", 
                style="casual", silhouette="regular", color="blue", pattern="solid", 
                season="summer", occasion="casual", id=1),
        Clothing(image_data=None, main_category="top", sub_category="t-shirt", 
                style="casual", silhouette="regular", color="red", pattern="solid", 
                season="summer", occasion="casual", id=2),
        Clothing(image_data=None, main_category="top", sub_category="t-shirt", 
                style="casual", silhouette="regular", color="black", pattern="solid", 
                season="summer", occasion="casual", id=3),
        Clothing(image_data=None, main_category="top", sub_category="t-shirt", 
                style="casual", silhouette="regular", color="white", pattern="solid", 
                season="summer", occasion="casual", id=4),
        Clothing(image_data=None, main_category="top", sub_category="t-shirt", 
                style="casual", silhouette="regular", color="gray", pattern="solid", 
                season="summer", occasion="casual", id=5),
        Clothing(image_data=None, main_category="top", sub_category="t-shirt", 
                style="casual", silhouette="regular", color="green", pattern="solid", 
                season="summer", occasion="casual", id=6),
        Clothing(image_data=None, main_category="top", sub_category="t-shirt", 
                style="casual", silhouette="regular", color="yellow", pattern="solid", 
                season="summer", occasion="casual", id=7),
        Clothing(image_data=None, main_category="top", sub_category="t-shirt", 
                style="casual", silhouette="regular", color="navy", pattern="striped", 
                season="summer", occasion="casual", id=8),
        Clothing(image_data=None, main_category="top", sub_category="t-shirt", 
                style="casual", silhouette="regular", color="green", pattern="graphic", 
                season="summer", occasion="casual", id=9),
        Clothing(image_data=None, main_category="top", sub_category="t-shirt", 
                style="casual", silhouette="regular", color="pink", pattern="solid", 
                season="summer", occasion="casual", id=10)
    ]
    wardrobe.extend(t_shirts)
    
    # Create 10 dress shirts
    dress_shirts = [
        Clothing(image_data=None, main_category="top", sub_category="button-up shirt", 
                style="formal", silhouette="fitted", color="white", pattern="solid", 
                season="all", occasion="formal", id=11),
        Clothing(image_data=None, main_category="top", sub_category="button-up shirt", 
                style="formal", silhouette="fitted", color="light blue", pattern="solid", 
                season="all", occasion="formal", id=12),
        Clothing(image_data=None, main_category="top", sub_category="button-up shirt", 
                style="business", silhouette="regular", color="pink", pattern="solid", 
                season="spring", occasion="work", id=13),
        Clothing(image_data=None, main_category="top", sub_category="button-up shirt", 
                style="business", silhouette="regular", color="lavender", pattern="solid", 
                season="spring", occasion="work", id=14),
        Clothing(image_data=None, main_category="top", sub_category="button-up shirt", 
                style="business", silhouette="fitted", color="blue", pattern="striped", 
                season="all", occasion="work", id=15),
        Clothing(image_data=None, main_category="top", sub_category="button-up shirt", 
                style="business", silhouette="fitted", color="white", pattern="striped", 
                season="all", occasion="work", id=16),
        Clothing(image_data=None, main_category="top", sub_category="button-up shirt", 
                style="business", silhouette="regular", color="gray", pattern="solid", 
                season="fall", occasion="work", id=17),
        Clothing(image_data=None, main_category="top", sub_category="button-up shirt", 
                style="formal", silhouette="fitted", color="black", pattern="solid", 
                season="all", occasion="formal", id=18),
        Clothing(image_data=None, main_category="top", sub_category="button-up shirt", 
                style="business", silhouette="regular", color="blue", pattern="checkered", 
                season="all", occasion="work", id=19),
        Clothing(image_data=None, main_category="top", sub_category="button-up shirt", 
                style="business", silhouette="regular", color="yellow", pattern="solid", 
                season="spring", occasion="work", id=20)
    ]
    wardrobe.extend(dress_shirts)
    
    # Create 10 pants
    pants = [
        Clothing(image_data=None, main_category="bottom", sub_category="jeans", 
                style="casual", silhouette="regular", color="blue", pattern="solid", 
                season="all", occasion="casual", id=21),
        Clothing(image_data=None, main_category="bottom", sub_category="jeans", 
                style="casual", silhouette="slim", color="black", pattern="solid", 
                season="all", occasion="casual", id=22),
        Clothing(image_data=None, main_category="bottom", sub_category="jeans", 
                style="casual", silhouette="regular", color="gray", pattern="solid", 
                season="all", occasion="casual", id=23),
        Clothing(image_data=None, main_category="bottom", sub_category="chinos", 
                style="business", silhouette="slim", color="navy", pattern="solid", 
                season="all", occasion="work", id=24),
        Clothing(image_data=None, main_category="bottom", sub_category="chinos", 
                style="business", silhouette="regular", color="beige", pattern="solid", 
                season="all", occasion="work", id=25),
        Clothing(image_data=None, main_category="bottom", sub_category="slacks", 
                style="formal", silhouette="tailored", color="gray", pattern="solid", 
                season="all", occasion="formal", id=26),
        Clothing(image_data=None, main_category="bottom", sub_category="slacks", 
                style="formal", silhouette="tailored", color="black", pattern="solid", 
                season="all", occasion="formal", id=27),
        Clothing(image_data=None, main_category="bottom", sub_category="slacks", 
                style="formal", silhouette="tailored", color="navy", pattern="solid", 
                season="all", occasion="formal", id=28),
        Clothing(image_data=None, main_category="bottom", sub_category="jeans", 
                style="casual", silhouette="regular", color="brown", pattern="solid", 
                season="fall", occasion="casual", id=29),
        Clothing(image_data=None, main_category="bottom", sub_category="chinos", 
                style="casual", silhouette="slim", color="green", pattern="solid", 
                season="fall", occasion="casual", id=30)
    ]
    wardrobe.extend(pants)
    
    # Create 10 shorts
    shorts = [
        Clothing(image_data=None, main_category="bottom", sub_category="shorts", 
                style="casual", silhouette="regular", color="beige", pattern="solid", 
                season="summer", occasion="casual", id=31),
        Clothing(image_data=None, main_category="bottom", sub_category="shorts", 
                style="casual", silhouette="regular", color="navy", pattern="solid", 
                season="summer", occasion="casual", id=32),
        Clothing(image_data=None, main_category="bottom", sub_category="shorts", 
                style="casual", silhouette="regular", color="black", pattern="solid", 
                season="summer", occasion="casual", id=33),
        Clothing(image_data=None, main_category="bottom", sub_category="shorts", 
                style="casual", silhouette="regular", color="gray", pattern="solid", 
                season="summer", occasion="casual", id=34),
        Clothing(image_data=None, main_category="bottom", sub_category="shorts", 
                style="casual", silhouette="regular", color="blue", pattern="solid", 
                season="summer", occasion="casual", id=35),
        Clothing(image_data=None, main_category="bottom", sub_category="shorts", 
                style="casual", silhouette="regular", color="green", pattern="solid", 
                season="summer", occasion="casual", id=36),
        Clothing(image_data=None, main_category="bottom", sub_category="shorts", 
                style="casual", silhouette="regular", color="red", pattern="solid", 
                season="summer", occasion="casual", id=37),
        Clothing(image_data=None, main_category="bottom", sub_category="shorts", 
                style="casual", silhouette="regular", color="blue", pattern="plaid", 
                season="summer", occasion="casual", id=38),
        Clothing(image_data=None, main_category="bottom", sub_category="shorts", 
                style="casual", silhouette="regular", color="white", pattern="solid", 
                season="summer", occasion="casual", id=39),
        Clothing(image_data=None, main_category="bottom", sub_category="athletic shorts", 
                style="athletic", silhouette="loose", color="black", pattern="solid", 
                season="summer", occasion="athletic", id=40)
    ]
    wardrobe.extend(shorts)
    
    # Create 10 shoes
    shoes = [
        Clothing(image_data=None, main_category="footwear", sub_category="dress shoes", 
                style="formal", silhouette="slim", color="black", pattern="solid", 
                season="all", occasion="formal", id=41),
        Clothing(image_data=None, main_category="footwear", sub_category="dress shoes", 
                style="formal", silhouette="slim", color="brown", pattern="solid", 
                season="all", occasion="formal", id=42),
        Clothing(image_data=None, main_category="footwear", sub_category="sneakers", 
                style="casual", silhouette="regular", color="white", pattern="solid", 
                season="all", occasion="casual", id=43),
        Clothing(image_data=None, main_category="footwear", sub_category="sneakers", 
                style="casual", silhouette="regular", color="black", pattern="solid", 
                season="all", occasion="casual", id=44),
        Clothing(image_data=None, main_category="footwear", sub_category="running shoes", 
                style="athletic", silhouette="athletic", color="blue", pattern="solid", 
                season="all", occasion="athletic", id=45),
        Clothing(image_data=None, main_category="footwear", sub_category="loafers", 
                style="business", silhouette="slim", color="brown", pattern="solid", 
                season="spring", occasion="work", id=46),
        Clothing(image_data=None, main_category="footwear", sub_category="boots", 
                style="casual", silhouette="heavy", color="black", pattern="solid", 
                season="winter", occasion="casual", id=47),
        Clothing(image_data=None, main_category="footwear", sub_category="boots", 
                style="casual", silhouette="heavy", color="brown", pattern="solid", 
                season="fall", occasion="casual", id=48),
        Clothing(image_data=None, main_category="footwear", sub_category="sandals", 
                style="casual", silhouette="open", color="brown", pattern="solid", 
                season="summer", occasion="casual", id=49),
        Clothing(image_data=None, main_category="footwear", sub_category="boat shoes", 
                style="casual", silhouette="slim", color="navy", pattern="solid", 
                season="summer", occasion="casual", id=50)
    ]
    wardrobe.extend(shoes)
    
    return wardrobe

def main():
    # Code to be executed when the script is run directly
    print("This is the main function.")

    wardrobe = create_sample_wardrobe()

    outfits = generate_ranked_outfits(wardrobe, {"weather": "cool", "occasion": "formal"})

    for outfit in outfits:
        print(f"Top: {outfit['top']} | Bottom: {outfit['bottom']} | Footwear: {outfit['footwear']} | Score: {outfit['score']}")

if __name__ == "__main__":
    main()

