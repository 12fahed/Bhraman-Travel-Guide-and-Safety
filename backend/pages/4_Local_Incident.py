import streamlit as st
import sqlite3
import uuid
import json
from datetime import datetime
import chromadb
# from components.sos_button import sos_button
# sos_button()
# ---------------------------
# SQLite Setup
# ---------------------------
# Connect to (or create) the database
conn = sqlite3.connect("local_incidents.db", check_same_thread=False)
c = conn.cursor()

# Create incidents table
c.execute('''
CREATE TABLE IF NOT EXISTS local_incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location TEXT,
    description TEXT,
    timestamp TEXT,
    username TEXT,
    blockchain_id TEXT,
    upvotes INTEGER,
    downvotes INTEGER,
    comments TEXT,
    isverified BOOLEAN
)
''')
conn.commit()

# Create users table
c.execute('''
CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    email TEXT,
    password TEXT,
    trust_score REAL
)
''')
conn.commit()

# ---------------------------
# ChromaDB Setup
# ---------------------------
chroma_client = chromadb.Client()
# Create (or get) a collection for incidents
incident_collection = chroma_client.get_or_create_collection(name="local_incidents")

# ---------------------------
# Helper Functions
# ---------------------------
def add_incident(location, description, timestamp, username, isverified):
    """Insert a new incident into SQLite and upsert to ChromaDB."""
    blockchain_id = str(uuid.uuid4())  # dummy blockchain-like id
    upvotes = 0
    downvotes = 0
    comments = json.dumps([])  # store comments as an empty JSON list
    # Insert into SQLite
    c.execute('''
    INSERT INTO local_incidents (location, description, timestamp, username, blockchain_id, upvotes, downvotes, comments, isverified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (location, description, timestamp, username, blockchain_id, upvotes, downvotes, comments, isverified))
    conn.commit()
    incident_id = c.lastrowid

    # Upsert incident description into ChromaDB (using the incident ID as string)
    incident_collection.upsert(
        documents=[description],
        ids=[str(incident_id)]
    )
    return incident_id

def search_incidents(query, n_results=5):
    """Use ChromaDB to perform a semantic search over incident descriptions and return the matching incidents from SQLite."""
    results = incident_collection.query(
        query_texts=[query],
        n_results=n_results
    )
    # 'ids' is a list of lists (one per query)
    incident_ids = results.get("ids", [[]])[0]
    incidents = []
    for incident_id in incident_ids:
        c.execute("SELECT * FROM local_incidents WHERE id = ?", (incident_id,))
        row = c.fetchone()
        if row:
            incidents.append(row)
    return incidents

# ---------------------------
# Streamlit UI
# ---------------------------
st.title("Local Incidents Semantic Search App")

menu = st.sidebar.selectbox("Menu", ["Add Incident", "Search Incidents", "User Registration"])

if menu == "Add Incident":
    st.header("Add a New Incident")
    with st.form("incident_form"):
        location = st.text_input("Location")
        description = st.text_area("Description (e.g., details from a news article or social media post)")
        username = st.text_input("Username")
        isverified = st.checkbox("Is Verified", value=False)
        submitted = st.form_submit_button("Submit Incident")
        if submitted:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            incident_id = add_incident(location, description, timestamp, username, isverified)
            st.success(f"Incident added with ID: {incident_id}")

elif menu == "Search Incidents":
    st.header("Search Local Incidents")
    query = st.text_input("Enter your search query")
    if st.button("Search"):
        if query:
            incidents = search_incidents(query)
            if incidents:
                st.write("### Search Results:")
                for incident in incidents:
                    # Incident tuple: (id, location, description, timestamp, username, blockchain_id, upvotes, downvotes, comments, isverified)
                    st.markdown(f"**Incident ID:** {incident[0]}")
                    st.markdown(f"**Location:** {incident[1]}")
                    st.markdown(f"**Description:** {incident[2]}")
                    st.markdown(f"**Timestamp:** {incident[3]}")
                    st.markdown(f"**Username:** {incident[4]}")
                    st.markdown(f"**Blockchain ID:** {incident[5]}")
                    st.markdown(f"**Upvotes:** {incident[6]} | **Downvotes:** {incident[7]}")
                    st.markdown(f"**Comments:** {incident[8]}")
                    st.markdown(f"**Verified:** {incident[9]}")
                    st.markdown("---")
            else:
                st.write("No incidents found matching your query.")
        else:
            st.write("Please enter a search query.")

elif menu == "User Registration":
    st.header("Register New User")
    with st.form("registration_form"):
        username = st.text_input("Username")
        email = st.text_input("Email")
        password = st.text_input("Password", type="password")
        trust_score = st.slider("Trust Score", 0.0, 1.0, 0.5)
        submitted = st.form_submit_button("Register")
        if submitted:
            try:
                c.execute("INSERT INTO users (username, email, password, trust_score) VALUES (?, ?, ?, ?)",
                          (username, email, password, trust_score))
                conn.commit()
                st.success("User registered successfully!")
            except sqlite3.IntegrityError:
                st.error("Username already exists. Please choose a different username.")
