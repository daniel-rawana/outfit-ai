import psycopg2
from psycopg2 import sql
import base64
from tabulate import tabulate  # You may need to install this package: pip install tabulate
import os
from dotenv import load_dotenv
import urllib.parse

# Load environment variables
load_dotenv()

# Get database connection from environment or use default
DATABASE_URL = os.environ.get("DATABASE_URL", "https://mddfjqugsdtngqwtasjb.supabase.co")

class WardrobeDatabaseViewer:
    def __init__(self, database_url=DATABASE_URL):
        """Initialize connection to the PostgreSQL database"""
        self.database_url = database_url
        
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

    def list_databases(self):
        """List all databases on the server"""
        conn = self.connect()
        if not conn:
            return
        
        try:
            cur = conn.cursor()
            cur.execute("SELECT datname FROM pg_database WHERE datistemplate = false;")
            databases = cur.fetchall()
            
            print("\n=== DATABASES ===")
            for db in databases:
                print(f"- {db[0]}")
                
        except Exception as e:
            print(f"Error listing databases: {e}")
        finally:
            cur.close()
            conn.close()

    def list_tables(self):
        """List all tables in the current database"""
        conn = self.connect()
        if not conn:
            return
        
        try:
            cur = conn.cursor()
            cur.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """)
            tables = cur.fetchall()
            
            print(f"\n=== TABLES IN DATABASE ===")
            for table in tables:
                cur.execute(sql.SQL("SELECT COUNT(*) FROM {}").format(
                    sql.Identifier(table[0])
                ))
                count = cur.fetchone()[0]
                print(f"- {table[0]} ({count} records)")
                
        except Exception as e:
            print(f"Error listing tables: {e}")
        finally:
            cur.close()
            conn.close()

    def table_structure(self, table_name):
        """Show the structure of a specific table"""
        conn = self.connect()
        if not conn:
            return
        
        try:
            cur = conn.cursor()
            cur.execute("""
                SELECT column_name, data_type, character_maximum_length
                FROM information_schema.columns
                WHERE table_name = %s
                ORDER BY ordinal_position
            """, (table_name,))
            columns = cur.fetchall()
            
            print(f"\n=== STRUCTURE OF TABLE '{table_name}' ===")
            headers = ["Column", "Type", "Max Length"]
            table_data = []
            
            for col in columns:
                col_name, data_type, max_length = col
                max_length = str(max_length) if max_length else "N/A"
                table_data.append([col_name, data_type, max_length])
                
            print(tabulate(table_data, headers=headers, tablefmt="grid"))
                
        except Exception as e:
            print(f"Error showing table structure: {e}")
        finally:
            cur.close()
            conn.close()

    def view_table_data(self, table_name, limit=10):
        """View data in a specific table"""
        conn = self.connect()
        if not conn:
            return
        
        try:
            cur = conn.cursor()
            
            # Get column names first
            cur.execute("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = %s
                ORDER BY ordinal_position
            """, (table_name,))
            columns = [col[0] for col in cur.fetchall()]
            
            # Check if this table contains BYTEA (image) data
            has_bytea = False
            bytea_columns = []
            for col in columns:
                cur.execute("""
                    SELECT data_type
                    FROM information_schema.columns
                    WHERE table_name = %s AND column_name = %s
                """, (table_name, col))
                data_type = cur.fetchone()[0]
                if data_type == 'bytea':
                    has_bytea = True
                    bytea_columns.append(col)
            
            # Query the data
            cur.execute(
                sql.SQL("SELECT * FROM {} LIMIT %s").format(sql.Identifier(table_name)),
                (limit,)
            )
            rows = cur.fetchall()
            
            print(f"\n=== DATA IN TABLE '{table_name}' (First {limit} rows) ===")
            
            if not rows:
                print("No data found in this table.")
                return
            
            # Format the data for display
            table_data = []
            for row in rows:
                formatted_row = []
                for i, value in enumerate(row):
                    if has_bytea and columns[i] in bytea_columns and value is not None:
                        # For BYTEA data, just indicate that it contains image data
                        formatted_row.append("[BINARY IMAGE DATA]")
                    else:
                        # Truncate long text values for display
                        if isinstance(value, str) and len(value) > 50:
                            formatted_row.append(value[:47] + "...")
                        else:
                            formatted_row.append(value)
                table_data.append(formatted_row)
            
            print(tabulate(table_data, headers=columns, tablefmt="grid"))
            
        except Exception as e:
            print(f"Error viewing table data: {e}")
        finally:
            cur.close()
            conn.close()

    def save_image(self, table_name, image_column, id_column, id_value, output_file):
        """Extract and save an image from BYTEA data"""
        conn = self.connect()
        if not conn:
            return
        
        try:
            cur = conn.cursor()
            
            # Extract the image data
            query = sql.SQL("SELECT {} FROM {} WHERE {} = %s").format(
                sql.Identifier(image_column),
                sql.Identifier(table_name),
                sql.Identifier(id_column)
            )
            cur.execute(query, (id_value,))
            result = cur.fetchone()
            
            if not result or not result[0]:
                print(f"No image found for {id_column}={id_value}")
                return
            
            # Save the binary data to a file
            with open(output_file, 'wb') as f:
                f.write(result[0])
                
            print(f"Image saved to {output_file}")
            
        except Exception as e:
            print(f"Error extracting image: {e}")
        finally:
            cur.close()
            conn.close()

    def run_interactive(self):
        """Run an interactive session to explore the database"""
        while True:
            print("\n=== WARDROBE DATABASE VIEWER ===")
            print("1. List all databases")
            print("2. List all tables")
            print("3. View table structure")
            print("4. View table data")
            print("5. Extract image from database")
            print("0. Exit")
            
            choice = input("\nEnter your choice (0-5): ")
            
            if choice == '0':
                print("Goodbye!")
                break
                
            elif choice == '1':
                self.list_databases()
                
            elif choice == '2':
                self.list_tables()
                
            elif choice == '3':
                table_name = input("Enter table name: ")
                self.table_structure(table_name)
                
            elif choice == '4':
                table_name = input("Enter table name: ")
                try:
                    limit = int(input("How many rows to display? [10]: ") or "10")
                except ValueError:
                    limit = 10
                self.view_table_data(table_name, limit)
                
            elif choice == '5':
                table_name = input("Enter table name containing images: ")
                image_column = input("Enter column name containing BYTEA data: ")
                id_column = input("Enter ID column name: ")
                id_value = input("Enter ID value: ")
                output_file = input("Enter output filename (e.g., image.jpg): ")
                self.save_image(table_name, image_column, id_column, id_value, output_file)
                
            else:
                print("Invalid choice. Please try again.")


if __name__ == "__main__":
    # Create the database viewer with the connection from DATABASE_URL
    viewer = WardrobeDatabaseViewer()
    
    # Run the interactive interface
    viewer.run_interactive()