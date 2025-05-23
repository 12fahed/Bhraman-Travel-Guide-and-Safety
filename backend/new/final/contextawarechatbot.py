import streamlit as st
import chromadb
import chromadb.utils.embedding_functions as embedding_functions
from datetime import datetime
import google.generativeai as genai

# Initialize ChromaDB client and embedding function
st.title("ChromaDB Query and Generative AI App")

# User inputs for Google Generative AI API key
api_key = "AIzaSyCaMUsyaIG6IK_AmVWLj6CEyNTUgpQQWR4"
if api_key:
    google_ef = embedding_functions.GoogleGenerativeAiEmbeddingFunction(api_key=api_key)
    genai.configure(api_key=api_key)
    
    chroma_client = chromadb.HttpClient(host='localhost', port=8000)

    # Get or create collection
    collection_name = "my_collection"
    collection = chroma_client.get_or_create_collection(
        name=collection_name,
        embedding_function=google_ef,
        metadata={
            "description": "My first Chroma collection",
            "created": str(datetime.now())
        }
    )

    # Document and query input sections
    with st.form("document_input_form"):
        documents = st.text_area("Enter Documents (one per line)")
        doc_ids = st.text_area("Enter Document IDs (comma-separated)")
        submit_docs = st.form_submit_button("Upsert Documents")

    if submit_docs and documents and doc_ids:
        document_list = documents.split("\n")
        doc_id_list = doc_ids.split(",")
        if len(document_list) == len(doc_id_list):
            collection.upsert(documents=document_list, ids=doc_id_list)
            st.success("Documents successfully upserted.")
        else:
            st.error("Document count must match ID count.")

    query_text = st.text_input("Enter Query Text")
    results = None
    if st.button("Run Query") and query_text:
        results = collection.query(
            query_texts=[query_text],
            n_results=10
        )
        st.write("Query Results:", results)

    # Generative AI content generation
    if st.button("Generate Content from Generative AI") and query_text:
        model = genai.GenerativeModel("gemini-1.5-flash")
        results = collection.query(
            query_texts=[query_text],
            n_results=2
        )
        documents = results.get('documents', [])
        distances = results.get('distances', [])
        print(f"Query: {query_text} Documents: {documents} Distances: {distances}")
        response = model.generate_content(
        f"Answer the query: '{query_text}' using the provided context: '{results}'. Note: The similarity scores '{distances}' are only for your reference; do not include them in the answer.")
        st.write("Generated Content:")
        st.write(response.text)
else:
    st.warning("Please provide your API key to proceed.")
