import streamlit as st 
import chromadb
import chromadb.utils.embedding_functions as embedding_functions
from datetime import datetime
import google.generativeai as genai
import uuid
import base64
from io import BytesIO

# Page config
st.set_page_config(page_title="Dhan AI", layout="wide")

# Initialize session state
if 'chat_history' not in st.session_state:
    st.session_state.chat_history = []
if 'conversation_id' not in st.session_state:
    st.session_state.conversation_id = str(uuid.uuid4())

# Constants
API_KEY = "AIzaSyCaMUsyaIG6IK_AmVWLj6CEyNTUgpQQWR4"  # In production, use st.secrets
COLLECTION_NAME = "chat_memory"

# Initialize ChromaDB and Gemini
google_ef = embedding_functions.GoogleGenerativeAiEmbeddingFunction(api_key=API_KEY)
genai.configure(api_key=API_KEY)
chat_model = genai.GenerativeModel("gemini-1.5-flash")
vision_model = genai.GenerativeModel("gemini-1.5-flash")

# Initialize ChromaDB client
chroma_client = chromadb.HttpClient(host='localhost', port=8000)

# Get or create collection
collection = chroma_client.get_or_create_collection(
    name=COLLECTION_NAME,
    embedding_function=google_ef,
    metadata={
        "description": "Chat memory storage",
        "created": str(datetime.now())
    }
)

def process_image(image_file) -> str:
    """Process uploaded image and generate description using Gemini."""
    if image_file is None:
        return None
    
    # Read image file
    bytes_data = image_file.getvalue()
    base64_image = base64.b64encode(bytes_data).decode('utf-8')
    
    # Generate image description
    prompt = "Provide a detailed description of this image that captures its key elements and context."
    response = vision_model.generate_content([
        {'mime_type': 'image/jpeg', 'data': base64_image},
        prompt
    ])
    
    return response.text

def store_message(role: str, content: str, has_image: bool = False):
    """Store a message in ChromaDB with embeddings."""
    message_id = f"{st.session_state.conversation_id}_{len(st.session_state.chat_history)}"
    
    metadata = {
        "role": role,
        "conversation_id": st.session_state.conversation_id,
        "timestamp": str(datetime.now()),
        "has_image": has_image
    }
    
    # Store in ChromaDB
    collection.upsert(
        documents=[content],
        ids=[message_id],
        metadatas=[metadata]
    )
    
    # Update chat history
    st.session_state.chat_history.append({
        "role": role, 
        "content": content,
        "has_image": has_image
    })

def get_relevant_context(query: str, n_results: int = 5) -> list:
    """Retrieve relevant context from previous conversations."""
    results = collection.query(
        query_texts=[query],
        n_results=n_results,
        where={"conversation_id": st.session_state.conversation_id}
    )
    
    context_messages = []
    for doc, metadata in zip(results['documents'][0], results['metadatas'][0]):
        # Handle legacy messages that don't have has_image field
        has_image = metadata.get('has_image', False)
        context_messages.append({
            "role": metadata['role'],
            "content": doc,
            "has_image": has_image
        })
    
    return context_messages

def generate_response(query: str, context_messages: list) -> str:
    """Generate a response using context-aware prompting."""
    context_str = "\n".join([
        f"{msg['role']}: {msg['content']} {'(includes image description)' if msg.get('has_image', False) else ''}" 
        for msg in context_messages
    ])
    
    prompt = f"""You are a Financial AI Chatbot called as Dhan AI. Your job is to provide a response in an ongoing conversation. 

Previous relevant context:
{'-' * 40}
{context_str}
{'-' * 40}

Current query: {query}

Instructions:
1. Consider the conversation history and context provided above
2. Provide a response that:
   - Maintains continuity with previous relevant messages
   - Directly addresses the current query
   - Uses a natural, conversational tone
   - References relevant information from the context when appropriate
   - Acknowledges any images that were shared when relevant
   - Avoids repeating information unless necessary for clarity

Response:"""

    response = chat_model.generate_content(prompt)
    return response.text

# UI Layout
st.title("Dhan AI")

# Chat interface
for message in st.session_state.chat_history:
    with st.chat_message(message["role"]):
        st.write(message["content"])

# Chat input and image upload
image_file = st.file_uploader("Upload an image (optional)", type=['png', 'jpg', 'jpeg'])
if prompt := st.chat_input("What would you like to discuss?"):
    # Display user message
    with st.chat_message("user"):
        st.write(prompt)
        if image_file:
            st.image(image_file)
    
    # Process image if provided
    image_description = None
    if image_file:
        with st.spinner('Processing image...'):
            image_description = process_image(image_file)
        
        # Store the image description
        if image_description:
            full_message = f"{prompt}\n\nImage description: {image_description}"
            store_message("user", full_message, has_image=True)
        else:
            store_message("user", prompt)
    else:
        store_message("user", prompt)
    
    # Get relevant context
    context = get_relevant_context(prompt)
    
    # Generate and display response
    with st.chat_message("assistant"):
        response = generate_response(prompt, context)
        st.write(response)
    
    # Store assistant response
    store_message("assistant", response)

# Sidebar for debugging
# with st.sidebar:
#     st.header("Debug Information")
#     if st.button("Show Collection Stats"):
#         st.write(f"Total messages: {collection.count()}")
#         st.write(f"Current conversation ID: {st.session_state.conversation_id}")
    
#     if st.button("Start New Conversation"):
#         st.session_state.conversation_id = str(uuid.uuid4())
#         st.session_state.chat_history = []
#         st.rerun()