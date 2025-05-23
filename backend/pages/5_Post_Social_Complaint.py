import streamlit as st 
import sqlite3
from PIL import Image
import io
import base64
# from components.sos_button import sos_button
# sos_button()

# Initialize SQLite Database
db_path = "db/posts.db"
conn = sqlite3.connect(db_path, check_same_thread=False)
c = conn.cursor()
st.markdown("""
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
        *{
            font-family: 'Poppins', sans-serif;
            }
 
        #MainMenu {visibility: hidden;}
        header {visibility: hidden;}
        footer {visibility: hidden;}
    </style>
""", unsafe_allow_html=True)
# Check if the columns exist and add them if they don't
def check_and_update_schema():
    # Get existing columns
    c.execute("PRAGMA table_info(posts)")
    columns = [column[1] for column in c.fetchall()]
    
    # Add missing columns
    if "username" not in columns:
        c.execute("ALTER TABLE posts ADD COLUMN username TEXT DEFAULT 'Anonymous'")
    if "image_data" not in columns:
        c.execute("ALTER TABLE posts ADD COLUMN image_data TEXT DEFAULT NULL")
    conn.commit()

# Create tables if they don't exist
c.execute("""
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    votes INTEGER DEFAULT 0
)
""")
c.execute("""
CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    text TEXT NOT NULL,
    votes INTEGER DEFAULT 0,
    FOREIGN KEY(post_id) REFERENCES posts(id)
)
""")
conn.commit()

# Update schema with new columns
check_and_update_schema()

# Sample usernames and avatar URLs
SAMPLE_USERS = [
    {"name": "Fahed Khan", "avatar": "https://xsgames.co/randomusers/avatar.php?g=male&seed=1"},
    {"name": "Sarah Ahmed", "avatar": "https://xsgames.co/randomusers/avatar.php?g=female&seed=2"},
    {"name": "Priya Patel", "avatar": "https://xsgames.co/randomusers/avatar.php?g=female&seed=3"},
    {"name": "James Wilson", "avatar": "https://xsgames.co/randomusers/avatar.php?g=male&seed=4"},
    {"name": "Sushmit Sanyal", "avatar": "https://xsgames.co/randomusers/avatar.php?g=male&seed=5"}
]

# Function to add a new post
def add_post(content, username="Anonymous", image_data=None):
    c.execute("INSERT INTO posts (content, votes, username, image_data) VALUES (?, 0, ?, ?)", 
              (content, username, image_data))
    conn.commit()

# Function to get all posts
def get_posts():
    # Use more defensive query that works with old and new schema
    try:
        c.execute("SELECT id, content, votes, username, image_data FROM posts ORDER BY id DESC")
        return c.fetchall()
    except sqlite3.OperationalError:
        # Fallback for original schema
        c.execute("SELECT id, content, votes FROM posts ORDER BY id DESC")
        posts = c.fetchall()
        # Add empty username and image_data
        return [(post[0], post[1], post[2], "Anonymous", None) for post in posts]

# Function to update votes
def update_votes(post_id, change):
    c.execute("UPDATE posts SET votes = votes + ? WHERE id = ?", (change, post_id))
    conn.commit()

# Function to add a comment
def add_comment(post_id, comment_text):
    c.execute("INSERT INTO comments (post_id, text, votes) VALUES (?, ?, 0)", (post_id, comment_text))
    conn.commit()

# Function to get comments for a post
def get_comments(post_id):
    c.execute("SELECT id, text, votes FROM comments WHERE post_id = ?", (post_id,))
    return c.fetchall()

# Function to update votes on comments
def update_comment_votes(comment_id, change):
    c.execute("UPDATE comments SET votes = votes + ? WHERE id = ?", (change, comment_id))
    conn.commit()

# Custom CSS for styling
st.markdown("""
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
        
            .stApp{
            background-color: #F8F2EF;
            }
        /* Main Styling */
        .main-header {
            font-family: 'Poppins', sans-serif;
            font-size: 32px;  /* Adjust size as needed */
            font-weight: 600;  /* Make it bold */
            text-align: left;
            color: #333;  /* Dark grey for readability */
            margin-left: 10px; /* Small left margin for better alignment */
            padding-bottom: 10px;
            border-bottom: 1px solid #f0f0f0;
            margin-top:0px;
            padding-top:0px;
        }
        
        /* Post Styling */
        .post-container {
            background-color: white;
            padding: 15px;
            border-radius: 12px;
            margin-bottom: 20px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            border: 1px solid #f0f0f0;
        }
        
        .post-header {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .avatar-image {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
            object-fit: cover;
        }
        
        .username {
            font-weight: bold;
            font-size: 1.1em;
            color: #14171A;
        }
        
        .post-content {
            margin-bottom: 15px;
            color: #14171A;
            font-size: 1em;
            line-height: 1.4;
        }
        
        .post-image-container {
            margin-bottom: 15px;
            border-radius: 12px;
            overflow: hidden;
            max-height: 400px;
        }
        
        .post-image {
            width: 100%;
            border-radius: 12px;
            object-fit: cover;
        }
        
        /* Action buttons - FIXED to use flex display */
        .action-buttons {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content:space-around;
            padding-top: 10px;
            border-top: 1px solid #f0f0f0;
            gap: 20px;
            width: 100%;
        }
        
        .action-buttons {
            background: none;
            border: none;
            color: #657786;
            font-size: 0.9em;
            display: flex;
            align-items: center;
            cursor: pointer;
            padding: 5px 10px;
            border-radius: 20px;
        }
        
        .action-button:hover {
            background-color: rgba(255, 87, 51, 0.1);
            color: #FF5733;
        }
        
        .action-icon {
            margin-right: 5px;
        }
        
        /* Comment Styling */
        .comment-container {
            background-color: #f8f9fa;
            padding: 10px 15px;
            border-radius: 10px;
            margin-top: 8px;
            margin-bottom: 8px;
            border-left: 3px solid #FF5733;
        }
        
        .comment-text {
            font-size: 0.9em;
            color: #14171A;
        }
        
        /* Floating Action Button - IMPROVED */
        .fab {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background-color: #FF5733;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .fab:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
        }
        
        /* New Post Form */
        .new-post-container {
            background-color: white;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 20px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .button-primary {
            background-color: #FF5733;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
        }
        
        .button-secondary {
            background-color: #f0f0f0;
            color: #FF5733;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
        }
        
        .image-button {
            background-color: #FF5733;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 15px;
        }
        
        .divider {
            height: 1px;
            background-color: #f0f0f0;
            margin: 5px 0 15px 0;
        }
        
        /* Fix button styling to remove default Streamlit styling */
        .stButton button {
            border: none;
            padding: 0;
            background: transparent;
        }
        
        /* Hide the file uploader default label */
        .css-9ycgxx {
            display: none;
        }
        
        /* Action buttons container */
        .action-container {
            display: flex;
            flex-direction: row;
            gap: 15px;
            align-items: center;
        }
        
        /* Inline buttons for post actions */
        .inline-button {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            cursor: pointer;
            background: none;
            border: none;
            font-size: 14px;
            color: #657786;
            padding: 5px 10px;
            border-radius: 20px;
            transition: background-color 0.2s;
        }
        
        .inline-button:hover {
            background-color: rgba(255, 87, 51, 0.1);
            color: #FF5733;
        }
    </style>
""", unsafe_allow_html=True)

# Add JavaScript to handle FAB click
st.markdown("""
<script>
document.addEventListener('DOMContentLoaded', function() {
    const fab = document.querySelector('.fab');
    if (fab) {
        fab.addEventListener('click', function() {
            const createButton = document.getElementById('create_post_button');
            if (createButton) {
                createButton.click();
            }
        });
    }
});
</script>
""", unsafe_allow_html=True)

# Streamlit UI
st.markdown("<h1 class='main-header'>Know Your Surrounding</h1>", unsafe_allow_html=True)

# Handle app state
if 'page' not in st.session_state:
    st.session_state.page = 'feed'
if 'current_user' not in st.session_state:
    st.session_state.current_user = SAMPLE_USERS[4]  # Default to Sushmit Sanyal
if 'image_data' not in st.session_state:
    st.session_state.image_data = None

# Floating Action Button - IMPROVED 
if st.session_state.page == 'feed':
    # Hidden button to handle the FAB click
    if st.button("Create Button", key="create_post_button", help="Create a new post"):
        st.session_state.page = 'create_post'
        st.rerun()
        
    # Add the FAB HTML
    st.markdown("""
        <div class='fab' onclick="document.getElementById('create_post_button').click();">+</div>
    """, unsafe_allow_html=True)
        # st.session_state.page = 'create_post'
    

# Create Post Page
if st.session_state.page == 'create_post':
    st.markdown("""
        <div class='new-post-container'>
            <div class='post-header'>
                <img src="{}" class='avatar-image' alt="User Avatar">
                <div class='username'>{}</div>
            </div>
        </div>
    """.format(st.session_state.current_user['avatar'], st.session_state.current_user['name']), unsafe_allow_html=True)
    
    new_post = st.text_area("What's happening around you?", key="new_post_text")
    
    # Image upload
    uploaded_file = st.file_uploader("", type=["jpg", "jpeg", "png"], key="post_image")
    if uploaded_file is not None:
        image = Image.open(uploaded_file)
        st.image(image, caption="Preview", use_column_width=True)
        
        # Convert to base64 for storage
        buffered = io.BytesIO()
        image.save(buffered, format="JPEG")
        st.session_state.image_data = base64.b64encode(buffered.getvalue()).decode()
    else:
        st.markdown("""
            <button class='image-button'>
                <span style='margin-right: 5px;'>📷</span> Image
            </button>
        """, unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    with col1:
        if st.button("Discard", key="discard_post"):
            st.session_state.page = 'feed'
            st.session_state.image_data = None
            st.rerun()
    with col2:
        if st.button("Post", key="submit_post"):
            if new_post.strip():
                add_post(new_post.strip(), st.session_state.current_user['name'], st.session_state.image_data)
                st.session_state.page = 'feed'
                st.session_state.image_data = None
                st.rerun()
            else:
                st.warning("Post cannot be empty!")

# Feed Page
if st.session_state.page == 'feed':
    posts = get_posts()
    for post in posts:
        post_id, content, votes, username, image_data = post
        
        # If username is empty, assign a random user
        if not username or username == "Anonymous":
            username = SAMPLE_USERS[post_id % len(SAMPLE_USERS)]['name']
            avatar_url = SAMPLE_USERS[post_id % len(SAMPLE_USERS)]['avatar']
        else:
            # Find matching user or use default
            matching_users = [u for u in SAMPLE_USERS if u['name'] == username]
            if matching_users:
                avatar_url = matching_users[0]['avatar']
            else:
                avatar_url = SAMPLE_USERS[post_id % len(SAMPLE_USERS)]['avatar']
        
        # Post container
        st.markdown(f"""
            <div class='post-container'>
                <div class='post-header'>
                    <img src="{avatar_url}" class='avatar-image' alt="User Avatar">
                    <div class='username'>{username}</div>
                </div>
                <div class='post-content'>{content}</div>
        """, unsafe_allow_html=True)
        
        # Display image if available
        if image_data:
            st.markdown(f"""
                <div class='post-image-container'>
                    <img src="data:image/jpeg;base64,{image_data}" class='post-image' alt="Post Image">
                </div>
            """, unsafe_allow_html=True)
        
        # Action buttons rendered directly in HTML for better flex layout
        comment_count = len(get_comments(post_id))
        st.markdown(f"""
            <div class='action-buttons'>
                <button id="upvote_{post_id}" class="inline-button upvote-button" style="font-size:22px;">
                    👍 {votes}
                </button>
                <button id="downvote_{post_id}" class="inline-button downvote-button" style="font-size:22px;">
                    👎{votes}
                </button>
                
            </div>
        """, unsafe_allow_html=True)
        
        # Hidden buttons to capture clicks from our custom HTML buttons
        col1, col2, col3 = st.columns([1, 1, 3])
        with col1:
            if st.button("Like", key=f"upvote_{post_id}", help="Like this post"):
                update_votes(post_id, 1)
                st.rerun()
        with col2:
            if st.button("Dislike", key=f"downvote_{post_id}", help="Dislike this post"):
                update_votes(post_id, -1)
                st.rerun()
        # with col3:
        #     if st.button("Comments", key=f"show_comments_{post_id}", help="Show/hide comments"):
        #         if f"show_comments_{post_id}" not in st.session_state:
        #             st.session_state[f"show_comments_{post_id}"] = True
        #         else:
        #             st.session_state[f"show_comments_{post_id}"] = not st.session_state[f"show_comments_{post_id}"]
        #         st.rerun()
        
        # Connect our HTML buttons to the hidden Streamlit buttons via JavaScript
        st.markdown(f"""
        <script>
            document.getElementById("upvote_{post_id}").addEventListener("click", function() {{
                document.querySelector('button[key="upvote_{post_id}"]').click();
            }});
            document.getElementById("downvote_{post_id}").addEventListener("click", function() {{
                document.querySelector('button[key="downvote_{post_id}"]').click();
            }});
            
        </script>
        """, unsafe_allow_html=True)
        
        # Comments Section
        if f"show_comments_{post_id}" in st.session_state and st.session_state[f"show_comments_{post_id}"]:
            comments = get_comments(post_id)
            for comment in comments:
                comment_id, text, comment_votes = comment
                st.markdown(f"""
                    <div class='comment-container'>
                        <div class='comment-text'>{text}</div>
                        <div class='action-buttons' style="padding-top: 5px; border-top: none;">
                            <button id="comment_upvote_{comment_id}" class="inline-button">
                                👍 {comment_votes}
                            </button>
                            <button id="comment_downvote_{comment_id}" class="inline-button">
                                👎 {comment_votes}
                            </button>
                        </div>
                    </div>
                """, unsafe_allow_html=True)
                
                # Hidden buttons for comments
                comment_col1, comment_col2 = st.columns([1, 5])
                with comment_col1:
                    if st.button("Like", key=f"comment_upvote_{comment_id}", help="Like this comment"):
                        update_comment_votes(comment_id, 1)
                        st.rerun()
                with comment_col2:
                    if st.button("Dislike", key=f"comment_downvote_{comment_id}", help="Dislike this comment"):
                        update_comment_votes(comment_id, -1)
                        st.rerun()
                
                # Connect comment buttons
                st.markdown(f"""
                <script>
                    document.getElementById("comment_upvote_{comment_id}").addEventListener("click", function() {{
                        document.querySelector('button[key="comment_upvote_{comment_id}"]').click();
                    }});
                    document.getElementById("comment_downvote_{comment_id}").addEventListener("click", function() {{
                        document.querySelector('button[key="comment_downvote_{comment_id}"]').click();
                    }});
                </script>
                """, unsafe_allow_html=True)
            
            # Input form for new comment
            new_comment = st.text_input(f"Add a comment", key=f"comment_input_{post_id}")
            if st.button("Post Comment", key=f"comment_button_{post_id}"):
                if new_comment.strip():
                    add_comment(post_id, new_comment.strip())
                    st.rerun()
                else:
                    st.warning("Comment cannot be empty!")
        
        st.markdown("""
            </div>
            <div class='divider'></div>
        """, unsafe_allow_html=True)