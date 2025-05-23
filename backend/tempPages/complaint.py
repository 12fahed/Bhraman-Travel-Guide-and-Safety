import streamlit as st
from streamlit_option_menu import option_menu
import pandas as pd
import streamlit.components.v1 as components

# Set page configuration
st.set_page_config(
    page_title="Complaints Portal",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Hide default elements
st.markdown("""
    <style>
        #MainMenu {visibility: hidden;}
        header {visibility: hidden;}
        footer {visibility: hidden;}
    </style>
""", unsafe_allow_html=True)

# Initialize session state if not already done
if 'page' not in st.session_state:
    st.session_state.page = None

# Define HTML/CSS/JS for the main page
def get_main_html():
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
        <style>
            body {
                background-color: #F8F2EF;
                font-family: 'Poppins', sans-serif;
                padding: 20px;
                margin: 0;
            }
            
            h1 {
                color: #333333;
                text-align: center;
                padding: 20px 0;
                font-weight: 400;
                font-size: 2.2rem;
            }
            
            .container {
                max-width: 1200px;
                margin: 0 auto;
            }
            
            .button-row {
                display: flex;
                gap: 20px;
                margin-top: 40px;
            }
            
            .menu-button {
                flex: 1;
                height: 160px;
                background-color: #FFF5EE;
                color: #FF8C00;
                border: 2px solid #FF8C00;
                border-radius: 25px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .menu-button:hover {
                background-color: #FFE4B5;
            }
            
            .button-icon {
                font-size: 2.5rem;
                margin-bottom: 15px;
            }
            
            .button-text {
                font-weight: 500;
                font-size: 1.2rem;
            }

            @media (max-width: 768px) {
                .button-row {
                    flex-direction: column;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Submit Your Complaints</h1>
            
            <div class="button-row">
                <div class="menu-button" id="submit-button" onclick="navigateTo('submit')">
                    <div class="button-icon">📝</div>
                    <div class="button-text">Submit Complaint</div>
                </div>
                
                <div class="menu-button" id="previous-button" onclick="navigateTo('previous')">
                    <div class="button-icon">📋</div>
                    <div class="button-text">Previous Complaints</div>
                </div>
            </div>
        </div>

        <script>
            function navigateTo(page) {
                window.parent.postMessage({type: 'navigateTo', page: page}, '*');
            }
        </script>
    </body>
    </html>
    """

# Submit form HTML/CSS
def get_submit_form_html():
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
        <style>
            body {
                background-color: #F8F2EF;
                font-family: 'Poppins', sans-serif;
                padding: 20px;
                margin: 0;
            }
            
            h2 {
                color: #333333;
                padding: 10px 0;
                font-weight: 400;
                font-size: 1.8rem;
                margin-bottom: 30px;
            }
            
            .container {
                max-width: 800px;
                margin: 0 auto;
            }
            
            .form-group {
                margin-bottom: 25px;
            }
            
            label {
                display: block;
                margin-bottom: 8px;
                font-weight: 400;
                color: #333;
            }
            
            input, select, textarea {
                width: 100%;
                padding: 12px;
                border: 1px solid #ddd;
                border-radius: 0;
                font-family: 'Poppins', sans-serif;
                font-size: 1rem;
                background-color: white;
            }
            
            textarea {
                min-height: 150px;
                resize: vertical;
            }
            
            .button-group {
                display: flex;
                gap: 15px;
                margin-top: 30px;
            }
            
            .btn {
                padding: 12px 25px;
                border: 2px solid #FF8C00;
                background-color: #FFF5EE;
                color: #FF8C00;
                font-family: 'Poppins', sans-serif;
                font-weight: 500;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                border-radius: 25px;
            }
            
            .btn:hover {
                background-color: #FFE4B5;
            }
            
            .btn-primary {
                background-color: #FF8C00;
                color: white;
            }
            
            .btn-primary:hover {
                background-color: #FF7800;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Submit a New Complaint</h2>
            
            <form id="complaint-form">
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" name="name" required>
                </div>
                
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                
                <div class="form-group">
                    <label for="category">Complaint Category</label>
                    <select id="category" name="category" required>
                        <option value="">Select Category</option>
                        <option value="product">Product</option>
                        <option value="service">Service</option>
                        <option value="staff">Staff</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="complaint">Describe your complaint</label>
                    <textarea id="complaint" name="complaint" required></textarea>
                </div>
                
                <div class="button-group">
                    <button type="submit" class="btn btn-primary" id="submit-complaint">Submit</button>
                    <button type="button" class="btn" id="cancel-button">Cancel</button>
                </div>
            </form>
        </div>

        <script>
            document.getElementById('complaint-form').addEventListener('submit', function(e) {
                e.preventDefault();
                // In a real app, you would process the form data here
                window.parent.postMessage({type: 'formSubmitted', success: true}, '*');
            });
            
            document.getElementById('cancel-button').addEventListener('click', function() {
                window.parent.postMessage({type: 'navigateHome'}, '*');
            });
        </script>
    </body>
    </html>
    """

# Previous complaints HTML/CSS
def get_previous_complaints_html(data):
    # Convert data to HTML table rows
    table_rows = ""
    for index, row in data.iterrows():
        status_class = "status-pending"
        if row['Status'] == 'Resolved':
            status_class = "status-resolved"
        elif row['Status'] == 'In Progress':
            status_class = "status-progress"
            
        table_rows += f"""
        <tr>
            <td>{row['Date']}</td>
            <td>{row['Category']}</td>
            <td><span class="{status_class}">{row['Status']}</span></td>
        </tr>
        """
    
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
        <style>
            body {{
                background-color: #F8F2EF;
                font-family: 'Poppins', sans-serif;
                padding: 20px;
                margin: 0;
            }}
            
            h2 {{
                color: #333333;
                padding: 10px 0;
                font-weight: 400;
                font-size: 1.8rem;
                margin-bottom: 30px;
            }}
            
            .container {{
                max-width: 1000px;
                margin: 0 auto;
            }}
            
            table {{
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
                background-color: white;
            }}
            
            th {{
                background-color: #FFE4B5;
                color: #333;
                text-align: left;
                padding: 15px;
                font-weight: 500;
            }}
            
            td {{
                padding: 15px;
                border-bottom: 1px solid #ddd;
            }}
            
            tr:nth-child(even) {{
                background-color: #FFF5EE;
            }}
            
            .status-pending {{
                color: #FF8C00;
                background-color: rgba(255, 140, 0, 0.1);
                padding: 5px 10px;
                border-radius: 12px;
                display: inline-block;
            }}
            
            .status-resolved {{
                color: #28a745;
                background-color: rgba(40, 167, 69, 0.1);
                padding: 5px 10px;
                border-radius: 12px;
                display: inline-block;
            }}
            
            .status-progress {{
                color: #007bff;
                background-color: rgba(0, 123, 255, 0.1);
                padding: 5px 10px;
                border-radius: 12px;
                display: inline-block;
            }}
            
            .btn {{
                padding: 12px 25px;
                border: 2px solid #FF8C00;
                background-color: #FFF5EE;
                color: #FF8C00;
                font-family: 'Poppins', sans-serif;
                font-weight: 500;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                border-radius: 25px;
                display: inline-block;
            }}
            
            .btn:hover {{
                background-color: #FFE4B5;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Previous Complaints</h2>
            
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {table_rows}
                </tbody>
            </table>
            
            <button class="btn" id="back-button">Back to Home</button>
        </div>

        <script>
            document.getElementById('back-button').addEventListener('click', function() {{
                window.parent.postMessage({{type: 'navigateHome'}}, '*');
            }});
        </script>
    </body>
    </html>
    """

# Success message HTML
def get_success_html():
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
        <style>
            body {
                background-color: #F8F2EF;
                font-family: 'Poppins', sans-serif;
                padding: 20px;
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
            
            .success-container {
                background-color: white;
                border-radius: 10px;
                padding: 40px;
                text-align: center;
                box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                max-width: 500px;
                width: 100%;
            }
            
            .success-icon {
                font-size: 4rem;
                color: #28a745;
                margin-bottom: 20px;
            }
            
            h2 {
                color: #333;
                margin-bottom: 20px;
                font-weight: 500;
            }
            
            p {
                color: #666;
                margin-bottom: 30px;
                line-height: 1.6;
            }
            
            .btn {
                padding: 12px 25px;
                border: 2px solid #FF8C00;
                background-color: #FF8C00;
                color: white;
                font-family: 'Poppins', sans-serif;
                font-weight: 500;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                border-radius: 25px;
                display: inline-block;
                text-decoration: none;
            }
            
            .btn:hover {
                background-color: #FF7800;
            }
        </style>
    </head>
    <body>
        <div class="success-container">
            <div class="success-icon">✓</div>
            <h2>Complaint Submitted Successfully!</h2>
            <p>Thank you for your feedback. Our team will review your complaint and get back to you within 48 hours.</p>
            <button class="btn" id="home-button">Return to Home</button>
        </div>

        <script>
            document.getElementById('home-button').addEventListener('click', function() {
                window.parent.postMessage({type: 'navigateHome'}, '*');
            });
        </script>
    </body>
    </html>
    """

# Handle messages from HTML
def handle_messages():
    message_js = """
    <script>
    window.addEventListener('message', function(event) {
        if (event.data.type === 'navigateTo') {
            window.location.href = '/?page=' + event.data.page;
        } else if (event.data.type === 'navigateHome') {
            window.location.href = '/';
        } else if (event.data.type === 'formSubmitted' && event.data.success) {
            window.location.href = '/?page=success';
        }
    });
    </script>
    """
    st.markdown(message_js, unsafe_allow_html=True)

# Render appropriate component based on session state
handle_messages()

# Get page from query params
query_params = st.experimental_get_query_params()
if 'page' in query_params:
    st.session_state.page = query_params['page'][0]

# Sample data for previous complaints
data = {
    'Date': ['2024-02-20', '2024-02-19', '2024-02-15'],
    'Category': ['Product', 'Service', 'Staff'],
    'Status': ['Pending', 'Resolved', 'In Progress']
}
df = pd.DataFrame(data)

# Render the appropriate page
if st.session_state.page == "submit":
    components.html(get_submit_form_html(), height=800, scrolling=False)
elif st.session_state.page == "previous":
    components.html(get_previous_complaints_html(df), height=700, scrolling=True)
elif st.session_state.page == "success":
    components.html(get_success_html(), height=600, scrolling=False)
else:
    # Main landing page
    components.html(get_main_html(), height=400, scrolling=False)