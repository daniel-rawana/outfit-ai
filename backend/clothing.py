import io 
from PIL import Image, ImageTk 

class Clothing:
    def __init__(self, image_data, main_category, sub_category, 
                 style, silhouette, color, pattern, season, occasion, id):
        
        self.image_data = image_data
        self.main_category = main_category
        self.sub_category = sub_category
        self.style = style
        self.silhouette = silhouette
        self.color = color 
        self.pattern = pattern
        self.season = season
        self.occasion = occasion
        self.id = id
        
    # Convert Clothing object to dictionary 
    def to_dict(self):
        return {
            "image_data": self.image_data,
            "main_category": self.main_category,
            "sub_category": self.sub_category,
            "style": self.style,                
            "silhouette": self.silhouette,
            "color": self.color,
            "pattern": self.pattern,
            "season": self.season,                
            "occasion": self.occasion,
            "id": self.id
        }
        
    # Create a clothing object from a dictionary 
    def from_dict(cls, data, image_data=None):
        return cls(
            image_data=image_data,
            main_category=data.get("main_category"),
            sub_category=data.get("sub_category"),
            style=data.get("style"),
            silhouette=data.get("silhouette"),
            color=data.get("color"),
            pattern=data.get("pattern"),
            season=data.get("season"),
            occasion=data.get("occasion"),
            id=data.get("id")
        )
    
    def __str__(self):
        return f"{self.main_category} {self.sub_category} {self.color} {self.season} {self.occasion}"


