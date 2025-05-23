import sqlite3

# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('example.db')

# Create a cursor object to execute SQL commands
cursor = conn.cursor()

# Create a table
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    email TEXT UNIQUE NOT NULL
)
''')

# Insert data into the table
cursor.execute('''
INSERT INTO users (name, age, email)
VALUES (?, ?, ?)
''', ('John Doe', 30, 'john.doe@example.com'))

# Commit the changes
conn.commit()

# Query data from the table
cursor.execute('SELECT * FROM users')
rows = cursor.fetchall()

# Print the results
for row in rows:
    print(row)

# Update a record
cursor.execute('''
UPDATE users
SET age = ?
WHERE name = ?
''', (31, 'John Doe'))

# Delete a record
cursor.execute('''
DELETE FROM users
WHERE name = ?
''', ('John Doe',))

# Commit the changes and close the connection
conn.commit()
conn.close()

# from pdf2image import convert_from_path

# def extract_images_from_pdf(pdf_path, output_folder):
#     # Convert each page to an image
#     images = convert_from_path(pdf_path)

#     # Save each image to the specified folder
#     for i, image in enumerate(images):
#         image_path = f"{output_folder}/page_{i + 1}.png"
#         image.save(image_path, "PNG")
#         print(f"Saved: {image_path}")

# pdf_path = "path/to/your/file.pdf"
# output_folder = "path/to/output/folder"

# extract_images_from_pdf(pdf_path, output_folder)
