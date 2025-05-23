import sqlite3

# Connect to SQLite database (creates it if it doesn't exist)
conn = sqlite3.connect('db/users.db')
cursor = conn.cursor()

# Create a table to store user emails if it doesn't exist
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE
)
''')

# User email to store
user_email = "sushmit@gmail.com"

try:
    # Insert the user email into the database
    cursor.execute("INSERT INTO users (email) VALUES (?)", (user_email,))
    print(f"Successfully added user: {user_email}")
except sqlite3.IntegrityError:
    print(f"User {user_email} already exists in the database")

# Commit changes and close connection
conn.commit()
conn.close()

# Verification - Let's read the data back
conn = sqlite3.connect('users.db')
cursor = conn.cursor()
cursor.execute("SELECT * FROM users")
rows = cursor.fetchall()
print("\nUsers in database:")
for row in rows:
    print(f"ID: {row[0]}, Email: {row[1]}")
conn.close()