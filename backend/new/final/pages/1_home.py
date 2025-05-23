import streamlit as st
from tools import getTimestamp

st.title("About Page")
st.write("This is the about page content.")

# Take input
name = st.text_input("Enter your name")

if name == "Dhan":
    exec("st.write('Hello Dhan')")
    exec("""
currentDate = getTimestamp()
st.write('Current Date:', currentDate)
""")
