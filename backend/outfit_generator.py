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