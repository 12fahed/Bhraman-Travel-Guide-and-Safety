import streamlit as st
import chromadb
import chromadb.utils.embedding_functions as embedding_functions
from datetime import datetime
import google.generativeai as genai
import requests
# from components.sos_button import sos_button
# sos_button()

# Unsplash API configuration
UNSPLASH_ACCESS_KEY = "MtKPMwW2x5cgpY6GQeXmK1EhV08RFAOMt4f68Qg8jzM"

def fetch_travel_image(query):
    url = "https://api.unsplash.com/search/photos"
    params = {
        "query": query,
        "client_id": UNSPLASH_ACCESS_KEY,
        "per_page": 1
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        results = data.get("results", [])
        if results:
            return results[0]["urls"]["regular"]
    return None

st.title("Travel Chatbot")

# Initialize chat history in session state
if "messages" not in st.session_state:
    st.session_state.messages = []

# Google Generative AI API key configuration
api_key = "AIzaSyCaMUsyaIG6IK_AmVWLj6CEyNTUgpQQWR4"
if api_key:
    google_ef = embedding_functions.GoogleGenerativeAiEmbeddingFunction(api_key=api_key)
    genai.configure(api_key=api_key)
    
    chroma_client = chromadb.HttpClient(host='localhost', port=8000)
    collection_name = "travel_destinations"
    collection = chroma_client.get_or_create_collection(
        name=collection_name,
        embedding_function=google_ef,
        metadata={
            "description": "Travel destinations and guides",
            "created": str(datetime.now())
        }
    )
    
    # Display chat history
    for message in st.session_state.messages:
        if message["role"] == "user":
            st.markdown(f"**You:** {message['content']}")
        else:
            st.markdown(f"**Bot:** {message['content']}")
            if "image_url" in message:
                st.image(message["image_url"], caption="Destination Highlight", use_column_width=True)
    
    # Chat input form
    with st.form("chat_form", clear_on_submit=True):
        user_input = st.text_input("Your message:")
        submitted = st.form_submit_button("Send")
    
    if submitted and user_input:
        # Append user's message
        st.session_state.messages.append({"role": "user", "content": user_input})
        
        # Query the ChromaDB collection
        query_text = user_input
        results = collection.query(
            query_texts=[query_text],
            n_results=2
        )
        
        # Generate travel guide content using Generative AI
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(
            f"Answer the travel query: '{query_text}' using the following context: '{results}'.You can answer out of context too but remeber you are a travel app agent .Use tables (3 columns) if needed to show relevant data in tabular form. Do not include similarity scores in your answer.Don't say anything negative in  the start instead try to divert them by suggesting them any other similar question"
        )
        bot_response = response.text
        
        # Fetch a travel image from Unsplash based on the query
        image_url = fetch_travel_image(query_text)
        
        # Append bot's response
        bot_message = {"role": "bot", "content": bot_response}
        if image_url:
            bot_message["image_url"] = image_url
        st.session_state.messages.append(bot_message)
        
        # Rerun the script to display the updated chat history
        st.rerun()
else:
    st.warning("Please provide your API key to proceed.")
