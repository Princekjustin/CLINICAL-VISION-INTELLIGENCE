import streamlit as st

# Custom CSS for a professional "Clinical" look
st.markdown("""
    <style>
    .main { background-color: #f5f7f9; }
    .stButton>button {
        background-color: #004a99;
        color: white;
        border-radius: 5px;
        height: 3em;
        width: 100%;
    }
    .stTitle { color: #004a99; font-family: 'Helvetica'; }
    .status-box {
        padding: 20px;
        border-radius: 10px;
        background-color: #ffffff;
        box-shadow: 0px 4px 6px rgba(0,0,0,0.1);
    }
    </style>
    """, unsafe_allow_html=True)

# 1. Simple Login Logic
if 'logged_in' not in st.session_state:
    st.session_state['logged_in'] = False

def login():
    st.title("🏥 Clinical Diagnostic Login")
    username = st.text_input("Username")
    password = st.text_input("Password", type="password")
    if st.button("Login"):
        if username == "admin" and password == "password123": # Keep it simple for now!
            st.session_state['logged_in'] = True
            st.rerun()
        else:
            st.error("Invalid Credentials")

# 2. The Dashboard / Analysis Page
def dashboard():
    st.sidebar.title("Navigation")
    page = st.sidebar.radio("Go to", ["Dashboard", "New Analysis", "History"])

    if page == "Dashboard":
        st.title("📊 Clinical Dashboard")
        st.write("Welcome, Doctor. Here is your summary.")
        # Add small boxes/metrics here later
        
    elif page == "New Analysis":
        st.title("💉 Injection Angle Analysis")
        uploaded_file = st.file_uploader("Upload Injection Video", type=['mp4', 'mov'])
        
        if uploaded_file is not None:
            st.video(uploaded_file)
            if st.button("Run YOLO Diagnostic"):
                st.info("Running AI Model... Please wait.")
                # This is where we will link your model.predict() code!

# Logic to switch pages
if not st.session_state['logged_in']:
    login()
else:
    dashboard()