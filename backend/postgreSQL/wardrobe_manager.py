import psycopg2
import os
import tkinter as tk
from tkinter import filedialog, ttk, messagebox, simpledialog
from PIL import Image, ImageTk
import io
from dotenv import load_dotenv
import urllib.parse

# Load environment variables from wardrobe.env
load_dotenv(".env")

# Get database connection from environment or use default
DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql://postgres:GVX-hft.zyu1red5pyj@db.mddfjqugsdtngqwtasjb.supabase.co:5432/postgres")

class WardrobeManager:
    def __init__(self, database_url=DATABASE_URL):
        """Initialize the wardrobe manager with a database URL"""
        self.database_url = database_url
        self.ensure_tables_exist()
        
    def connect(self):
        """Establish a connection to the database"""
        try:
            # Parse components from the URL
            result = urllib.parse.urlparse(self.database_url)
            username = result.username
            password = result.password
            database = result.path[1:]
            hostname = result.hostname
            port = result.port
            
            conn = psycopg2.connect(
                database=database,
                user=username,
                password=password,
                host=hostname,
                port=port
            )
            return conn
        except Exception as e:
            print(f"Connection error: {e}")
            return None
            
    def ensure_tables_exist(self):
        """Create the necessary tables if they don't exist"""
        conn = self.connect()
        if not conn:
            return False
            
        try:
            cur = conn.cursor()
            
            # Create clothing_items table if it doesn't exist
            cur.execute("""
                CREATE TABLE IF NOT EXISTS clothing_items (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    category VARCHAR(50) NOT NULL,
                    description TEXT,
                    color VARCHAR(50),
                    season VARCHAR(50),
                    brand VARCHAR(100),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Create clothing_images table if it doesn't exist
            cur.execute("""
                CREATE TABLE IF NOT EXISTS clothing_images (
                    id SERIAL PRIMARY KEY,
                    clothing_id INTEGER REFERENCES clothing_items(id) ON DELETE CASCADE,
                    image_data BYTEA NOT NULL,
                    image_name VARCHAR(255),
                    content_type VARCHAR(100),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            conn.commit()
            return True
            
        except Exception as e:
            print(f"Error ensuring tables exist: {e}")
            return False
        finally:
            if conn:
                conn.close()
    
    def add_clothing_item(self, name, category, description="", color="", season="", brand=""):
        """Add a new clothing item to the database"""
        conn = self.connect()
        if not conn:
            return None
            
        try:
            cur = conn.cursor()
            
            query = """
            INSERT INTO clothing_items (name, category, description, color, season, brand)
            VALUES (%s, %s, %s, %s, %s, %s) RETURNING id;
            """
            
            cur.execute(query, (name, category, description, color, season, brand))
            item_id = cur.fetchone()[0]
            
            conn.commit()
            return item_id
            
        except Exception as e:
            conn.rollback()
            print(f"Error adding clothing item: {e}")
            return None
        finally:
            if conn:
                conn.close()
    
    def add_clothing_image(self, clothing_id, image_path):
        """Add an image for a clothing item"""
        conn = self.connect()
        if not conn:
            return None
            
        try:
            # Get file name and content type
            file_name = os.path.basename(image_path)
            content_type = self._get_content_type(file_name)
            
            # Read image file as binary data
            with open(image_path, 'rb') as f:
                image_data = f.read()
                
            cur = conn.cursor()
            
            query = """
            INSERT INTO clothing_images (clothing_id, image_data, image_name, content_type)
            VALUES (%s, %s, %s, %s) RETURNING id;
            """
            
            cur.execute(query, (clothing_id, psycopg2.Binary(image_data), file_name, content_type))
            image_id = cur.fetchone()[0]
            
            conn.commit()
            return image_id
            
        except Exception as e:
            conn.rollback()
            print(f"Error adding clothing image: {e}")
            return None
        finally:
            if conn:
                conn.close()
                
    def _get_content_type(self, filename):
        """Determine content type based on file extension"""
        ext = filename.lower().split('.')[-1]
        content_types = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'bmp': 'image/bmp'
        }
        return content_types.get(ext, 'application/octet-stream')

    def get_categories(self):
        """Get all existing categories from the database"""
        conn = self.connect()
        if not conn:
            return []
            
        try:
            cur = conn.cursor()
            cur.execute("SELECT DISTINCT category FROM clothing_items ORDER BY category")
            categories = [row[0] for row in cur.fetchall()]
            return categories
        except Exception as e:
            print(f"Error getting categories: {e}")
            return []
        finally:
            if conn:
                conn.close()
                
    def get_clothing_items(self):
        """Get all clothing items from the database"""
        conn = self.connect()
        if not conn:
            return []
            
        try:
            cur = conn.cursor()
            cur.execute("""
                SELECT id, name, category, brand, color
                FROM clothing_items
                ORDER BY category, name
            """)
            items = cur.fetchall()
            return items
        except Exception as e:
            print(f"Error getting clothing items: {e}")
            return []
        finally:
            if conn:
                conn.close()
                
    def get_image(self, image_id):
        """Get image data by ID"""
        conn = self.connect()
        if not conn:
            return None
            
        try:
            cur = conn.cursor()
            cur.execute("SELECT image_data FROM clothing_images WHERE id = %s", (image_id,))
            result = cur.fetchone()
            if result:
                return result[0]
            return None
        except Exception as e:
            print(f"Error getting image: {e}")
            return None
        finally:
            if conn:
                conn.close()
                
    def get_item_images(self, clothing_id):
        """Get all images for a clothing item"""
        conn = self.connect()
        if not conn:
            return []
            
        try:
            cur = conn.cursor()
            cur.execute("""
                SELECT id, image_name
                FROM clothing_images
                WHERE clothing_id = %s
                ORDER BY created_at
            """, (clothing_id,))
            images = cur.fetchall()
            return images
        except Exception as e:
            print(f"Error getting item images: {e}")
            return []
        finally:
            if conn:
                conn.close()


class WardrobeManagerGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Wardrobe Manager")
        self.root.geometry("800x600")
        
        # Initialize the wardrobe manager with Supabase connection
        self.manager = WardrobeManager()  # It will use the DATABASE_URL from wardrobe.env
        
        self.selected_image_path = None
        self.selected_item_id = None
        
        self.create_widgets()
        self.load_categories()
        self.load_items()
        
    def create_widgets(self):
        # Create main frames
        self.left_frame = ttk.Frame(self.root, padding=10)
        self.left_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        self.right_frame = ttk.Frame(self.root, padding=10)
        self.right_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)
        
        # Add new item section
        self.add_item_frame = ttk.LabelFrame(self.left_frame, text="Add New Clothing Item", padding=10)
        self.add_item_frame.pack(fill=tk.X, pady=5)
        
        ttk.Label(self.add_item_frame, text="Name:").grid(row=0, column=0, sticky=tk.W, pady=2)
        self.name_entry = ttk.Entry(self.add_item_frame, width=25)
        self.name_entry.grid(row=0, column=1, sticky=tk.W, pady=2)
        
        ttk.Label(self.add_item_frame, text="Category:").grid(row=1, column=0, sticky=tk.W, pady=2)
        self.category_var = tk.StringVar()
        self.category_combo = ttk.Combobox(self.add_item_frame, textvariable=self.category_var, width=22)
        self.category_combo.grid(row=1, column=1, sticky=tk.W, pady=2)
        
        ttk.Label(self.add_item_frame, text="Description:").grid(row=2, column=0, sticky=tk.W, pady=2)
        self.description_entry = ttk.Entry(self.add_item_frame, width=25)
        self.description_entry.grid(row=2, column=1, sticky=tk.W, pady=2)
        
        ttk.Label(self.add_item_frame, text="Color:").grid(row=3, column=0, sticky=tk.W, pady=2)
        self.color_entry = ttk.Entry(self.add_item_frame, width=25)
        self.color_entry.grid(row=3, column=1, sticky=tk.W, pady=2)
        
        ttk.Label(self.add_item_frame, text="Season:").grid(row=4, column=0, sticky=tk.W, pady=2)
        self.season_entry = ttk.Entry(self.add_item_frame, width=25)
        self.season_entry.grid(row=4, column=1, sticky=tk.W, pady=2)
        
        ttk.Label(self.add_item_frame, text="Brand:").grid(row=5, column=0, sticky=tk.W, pady=2)
        self.brand_entry = ttk.Entry(self.add_item_frame, width=25)
        self.brand_entry.grid(row=5, column=1, sticky=tk.W, pady=2)
        
        ttk.Label(self.add_item_frame, text="Image:").grid(row=6, column=0, sticky=tk.W, pady=2)
        self.image_button_frame = ttk.Frame(self.add_item_frame)
        self.image_button_frame.grid(row=6, column=1, sticky=tk.W, pady=2)
        
        self.image_label = ttk.Label(self.image_button_frame, text="No image selected")
        self.image_label.pack(side=tk.LEFT)
        
        self.browse_button = ttk.Button(self.image_button_frame, text="Browse...", command=self.browse_image)
        self.browse_button.pack(side=tk.LEFT, padx=5)
        
        self.add_button = ttk.Button(self.add_item_frame, text="Add Item + Image", command=self.add_item_with_image)
        self.add_button.grid(row=7, column=1, sticky=tk.E, pady=10)
        
        # Connection status
        self.connection_frame = ttk.Frame(self.left_frame)
        self.connection_frame.pack(fill=tk.X, pady=5)
        
        # Mask the connection string to hide credentials in UI
        connection_display = DATABASE_URL
        if ":" in connection_display and "@" in connection_display:
            parts = connection_display.split("@")
            auth_part = parts[0].split(":")
            masked_connection = f"{auth_part[0]}:****@{parts[1]}"
        else:
            masked_connection = "Using environment variable"
            
        self.connection_label = ttk.Label(
            self.connection_frame, 
            text=f"Connected to: {masked_connection}"
        )
        self.connection_label.pack(side=tk.LEFT)
        
        # Items list section
        self.items_frame = ttk.LabelFrame(self.left_frame, text="Clothing Items", padding=10)
        self.items_frame.pack(fill=tk.BOTH, expand=True, pady=5)
        
        # Create Treeview for items
        columns = ("ID", "Name", "Category", "Brand", "Color")
        self.items_tree = ttk.Treeview(self.items_frame, columns=columns, show="headings", height=10)
        
        # Define headings
        for col in columns:
            self.items_tree.heading(col, text=col)
            
        # Set column widths
        self.items_tree.column("ID", width=50)
        self.items_tree.column("Name", width=150)
        self.items_tree.column("Category", width=100)
        self.items_tree.column("Brand", width=100)
        self.items_tree.column("Color", width=80)
        
        # Add scrollbar
        scrollbar = ttk.Scrollbar(self.items_frame, orient=tk.VERTICAL, command=self.items_tree.yview)
        self.items_tree.configure(yscrollcommand=scrollbar.set)
        
        # Pack tree and scrollbar
        self.items_tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Bind select event
        self.items_tree.bind("<<TreeviewSelect>>", self.on_item_select)
        
        # Image preview section
        self.preview_frame = ttk.LabelFrame(self.right_frame, text="Image Preview", padding=10)
        self.preview_frame.pack(fill=tk.BOTH, expand=True)
        
        self.preview_label = ttk.Label(self.preview_frame)
        self.preview_label.pack(fill=tk.BOTH, expand=True)
        
        # Status bar
        self.status_var = tk.StringVar()
        self.status_var.set("Ready")
        self.status_bar = ttk.Label(self.root, textvariable=self.status_var, relief=tk.SUNKEN, anchor=tk.W)
        self.status_bar.pack(side=tk.BOTTOM, fill=tk.X)
        
    def load_categories(self):
        """Load categories into combobox"""
        categories = self.manager.get_categories()
        self.category_combo['values'] = list(categories) + ["-- New Category --"]
        
    def load_items(self):
        """Load clothing items into the treeview"""
        # Clear existing items
        for item in self.items_tree.get_children():
            self.items_tree.delete(item)
            
        # Get items from database
        items = self.manager.get_clothing_items()
        
        # Insert items into treeview
        for item in items:
            self.items_tree.insert("", tk.END, values=item)
            
    def browse_image(self):
        """Open file dialog to select an image"""
        filetypes = [
            ("Image files", "*.jpg *.jpeg *.png *.gif *.bmp *.webp"),
            ("All files", "*.*")
        ]
        
        filename = filedialog.askopenfilename(
            title="Select Image",
            filetypes=filetypes
        )
        
        if filename:
            self.selected_image_path = filename
            self.image_label.config(text=os.path.basename(filename))
            self.display_preview_image(filename)
            
    def display_preview_image(self, image_path):
        """Display the selected image in the preview panel"""
        try:
            # Open and resize image for preview
            img = Image.open(image_path)
            img.thumbnail((400, 400))  # Resize for preview
            
            # Convert to PhotoImage
            photo = ImageTk.PhotoImage(img)
            
            # Update preview label
            self.preview_label.config(image=photo)
            self.preview_label.image = photo  # Keep a reference
            
        except Exception as e:
            self.status_var.set(f"Error displaying image: {e}")
            
    def add_item_with_image(self):
        """Add a new clothing item with image to the database"""
        # Get values from form
        name = self.name_entry.get().strip()
        category = self.category_var.get().strip()
        description = self.description_entry.get().strip()
        color = self.color_entry.get().strip()
        season = self.season_entry.get().strip()
        brand = self.brand_entry.get().strip()
        
        # Validate inputs
        if not name:
            messagebox.showerror("Error", "Name is required")
            return
            
        if not category or category == "-- New Category --":
            new_category = simpledialog.askstring("New Category", "Enter a new category name:")
            if not new_category:
                messagebox.showerror("Error", "Category is required")
                return
            category = new_category
            
        if not self.selected_image_path:
            messagebox.showerror("Error", "Please select an image")
            return
            
        # Add item to database
        item_id = self.manager.add_clothing_item(name, category, description, color, season, brand)
        
        if item_id:
            # Add image
            image_id = self.manager.add_clothing_image(item_id, self.selected_image_path)
            
            if image_id:
                self.status_var.set(f"Added item '{name}' with image successfully")
                
                # Reset form
                self.name_entry.delete(0, tk.END)
                self.category_var.set("")
                self.description_entry.delete(0, tk.END)
                self.color_entry.delete(0, tk.END)
                self.season_entry.delete(0, tk.END)
                self.brand_entry.delete(0, tk.END)
                self.selected_image_path = None
                self.image_label.config(text="No image selected")
                self.preview_label.config(image=None)
                
                # Refresh data
                self.load_categories()
                self.load_items()
            else:
                self.status_var.set("Error adding image")
        else:
            self.status_var.set("Error adding clothing item")
            
    def on_item_select(self, event):
        """Handle item selection in the treeview"""
        selection = self.items_tree.selection()
        if selection:
            # Get the selected item
            item = self.items_tree.item(selection[0])
            item_id = item['values'][0]
            
            # Store the selected item ID
            self.selected_item_id = item_id
            
            # Get images for this item
            images = self.manager.get_item_images(item_id)
            
            if images:
                # Display the first image
                image_id = images[0][0]
                image_data = self.manager.get_image(image_id)
                
                if image_data:
                    self.display_image_from_data(image_data)
                    
    def display_image_from_data(self, image_data):
        """Display image from binary data"""
        try:
            # Convert binary data to image
            image = Image.open(io.BytesIO(image_data))
            image.thumbnail((400, 400))  # Resize for preview
            
            # Convert to PhotoImage
            photo = ImageTk.PhotoImage(image)
            
            # Update preview label
            self.preview_label.config(image=photo)
            self.preview_label.image = photo  # Keep a reference
            
        except Exception as e:
            self.status_var.set(f"Error displaying image: {e}")


if __name__ == "__main__":
    root = tk.Tk()
    app = WardrobeManagerGUI(root)
    root.mainloop()