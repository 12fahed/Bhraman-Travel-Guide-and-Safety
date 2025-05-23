import google.generativeai as genai
import re
import sqlite3

def greet(name):
    return f"Hello, {name}!"

# Example code to run
def execute_python_code(code_string: str):
    try:
        # Define a local namespace to allow access to the current functions
        local_namespace = globals().copy()
        exec(code_string, globals(), local_namespace)


        # Provide the namespace that includes the imported module
        # local_namespace = {"helpers": helpers}
        # exec(code_string, globals(), local_namespace)
    except Exception as e:
        print(f"Error while executing code: {e}")

# Example code to run
code_to_run = """
result = helpers.greet("Ritojnan")
print(result)
"""

execute_python_code(code_to_run)


genai.configure(api_key='AIzaSyCaMUsyaIG6IK_AmVWLj6CEyNTUgpQQWR4')
model = genai.GenerativeModel('gemini-1.5-flash')

# Function to get the structure of the database
def get_database_structure(cursor):
    structure = []
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()

    for table in tables:
        table_name = table[0]
        cursor.execute(f"PRAGMA table_info({table_name});")
        columns = cursor.fetchall()
        column_info = [f"{col[1]} ({col[2]})" for col in columns]
        structure.append(f"Table: {table_name}, Columns: {', '.join(column_info)}")
    return "\n".join(structure)


# Connect to SQLite database (replace with your DB connection)
conn = sqlite3.connect("example.db")
cursor = conn.cursor()

# Get database structure
db_structure = get_database_structure(cursor)
print("Database Structure:\n", db_structure)

while True:
    # Query the user for task description
    task_description = input("\n-----------------------\nWhat would you like to do with the database? (type 'EXIT' to quit) ")

    if task_description.strip().upper() == "EXIT":
        print("Exiting...")
        break
    print("-----------------------\n")
    db_structure = get_database_structure(cursor)
    print("Database Structure:\n", db_structure)
    # LLM prompt
    llm_prompt = f"""
    Given the following database structure:
    {db_structure}

    Generate a SQLite query to: {task_description}. Provide only the SQL query.Do not give the explanation.
    """

    # Generate SQL query using LLM
    response = model.generate_content(llm_prompt)
    sql_query = re.sub(r'^```sql\n|```$', '', response.text.strip(), flags=re.MULTILINE)
    

    print("Generated SQL Query:\n", sql_query)

    # Execute the generated query
    try:
        # Split multiple statements by semicolons and execute each individually
        queries = [query.strip() for query in sql_query.split(';') if query.strip()]
        
        for query in queries:
            cursor.execute(query)
            
            # Commit changes for data modification operations
            if query.upper().startswith(("INSERT", "UPDATE", "DELETE", "DROP")):
                conn.commit()
                print(f"Executed and committed: {query}")
            else:
                results = cursor.fetchall()
                print("Query Results:")
                for row in results:
                    print(row)

    except Exception as e:
        print("Error executing query:", e)

# Close the connection
conn.close()
