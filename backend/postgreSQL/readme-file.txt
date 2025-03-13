### Database Setup

This project uses Supabase as a centralized PostgreSQL database. To connect to the database:

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ai-wardrobe-creator.git
   cd ai-wardrobe-creator
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

   Note for Linux users: If you encounter Tkinter issues, install the Tkinter package:
   ```bash
   sudo apt-get install python3-tk  # For Debian/Ubuntu
   sudo dnf install python3-tkinter  # For Fedora/RHEL
   ```

## Running the Applications

### Database Viewer

The database viewer allows you to explore the database contents and extract images.

```bash
python db_viewer.py
```

### Wardrobe Manager

The wardrobe manager provides a GUI for adding clothing items and images to the database.

```bash
python wardrobe_manager.py
```

## Code Structure

- `db_viewer.py` - Interactive console tool for viewing database contents
- `wardrobe_manager.py` - GUI application for managing wardrobe items
- `.env` - Contains database connection details (not included in repository)
- `requirements.txt` - Python dependencies

## Database Schema

### clothing_items
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR)
- `category` (VARCHAR)
- `description` (TEXT)
- `color` (VARCHAR)
- `season` (VARCHAR)
- `brand` (VARCHAR)
- `created_at` (TIMESTAMP)

### clothing_images
- `id` (SERIAL PRIMARY KEY)
- `clothing_id` (INTEGER, foreign key to clothing_items)
- `image_data` (BYTEA) - Binary image data
- `image_name` (VARCHAR)
- `content_type` (VARCHAR)
- `created_at` (TIMESTAMP)

## Contributing

1. Create a feature branch: `git checkout -b feature/new-feature`
2. Commit your changes: `git commit -am 'Add new feature'`
3. Push to the branch: `git push origin feature/new-feature`
4. Submit a pull request

## Important Notes

- **Never commit the `.env` file** as it contains sensitive database credentials
- When working with image data, be mindful of file sizes to avoid database bloat
- For large changes to the database schema, coordinate with the team first

