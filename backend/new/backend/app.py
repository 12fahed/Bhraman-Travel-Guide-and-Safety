import streamlit as st
import pandas as pd
import numpy as np
import streamlit as st
import chromadb
import chromadb.utils.embedding_functions as embedding_functions
from datetime import datetime
import google.generativeai as genai
import uuid
# Initialize ChromaDB client and embedding function
st.title("ChromaDB Query and Generative AI App")

# User inputs for Google Generative AI API key
api_key = "AIzaSyCaMUsyaIG6IK_AmVWLj6CEyNTUgpQQWR4"
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
        n_results=10
    )
    documents = results.get('documents', [])
    distances = results.get('distances', [])
    print(f"Query: {query_text} Documents: {documents} Distances: {distances}")
    response = model.generate_content(
    f"Answer the query: '{query_text}' using the provided context: '{results}' in the form Column: ColumnName | Row: RowName | Value. Note: The similarity scores '{distances}' are only for your reference; do not include them in the answer.")
    st.write("Generated Content:")
    st.write(response.text)




def preprocess_data(df):
    df = df.dropna(how='all')
    df = df.dropna(axis=1, how='all')
    df = df.fillna(np.nan)  # Retain NaN for easier processing
    df = df.drop_duplicates()
    df.columns = df.columns.str.lower().str.strip().str.replace(' ', '_')
    return df

def find_boundary_labels(df):
    row_headers = []
    col_headers = []

    # Determine the boundary row and column headers
    for i in range(len(df.index)):
        if df.iloc[i].isnull().all():
            break
        row_headers.append(df.index[i])

    for j in range(len(df.columns)):
        if df.iloc[:, j].isnull().all():
            break
        col_headers.append(df.columns[j])

    return row_headers, col_headers

def process_and_display(df, sheet_name):
    st.subheader(f"Processed Data from '{sheet_name}'")
    row_headers, col_headers = find_boundary_labels(df)
    
    for row_idx in range(df.shape[0]):
        for col_idx in range(df.shape[1]):
            value = df.iloc[row_idx, col_idx]
            row_name = row_headers[row_idx] if row_idx < len(row_headers) else "null"
            col_name = col_headers[col_idx] if col_idx < len(col_headers) else "null"
            
            # Skip missing values
            if pd.notna(value):
                # Update output format to match your desired result
                st.write(f"Column: {col_name} | Row: {row_name} : Value: {value} ID: {uuid.uuid4()}")
                collection.upsert(documents=[f"Column: {col_name} | Row: {row_name} : Value: {value}"], ids=[str(uuid.uuid4())])

st.title("Excel File Processor and Markdown Converter (Supports .xls and .xlsx)")

uploaded_file = st.file_uploader("Upload an Excel file", type=["xls", "xlsx"])

if uploaded_file:
    sheets = pd.read_excel(uploaded_file, sheet_name=None)
    st.write("### Sheets Found:")
    st.write(list(sheets.keys()))
    processed_books = {}

    for sheet_name, df in sheets.items():
        processed_df = preprocess_data(df)
        processed_books[sheet_name] = processed_df
        process_and_display(processed_df, sheet_name)
