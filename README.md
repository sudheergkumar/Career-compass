# 🧭 Career Compass MVP

Welcome to **Career Compass**! This project is an AI-based Career Exploration and Scholarship Recommendation System. It uses a custom Machine Learning model to evaluate a student's psychometric traits (RIASEC model), academic scores, and self-assessed skills to map them to the perfect career domains while recommending tailored scholarships.

This guide is written specifically for **beginners**. If you have just downloaded or cloned this code from GitHub, follow the exact steps below to get it running on your own computer!

---

## 🛠️ Step 1: Install the Requirements
Before running the code, your computer needs to have **Python** (for the AI and backend) and **Node.js** (for the frontend website) installed.

1. **Install Node.js**: 
   - Go to [nodejs.org](https://nodejs.org/) and download the "LTS" (Long Term Support) version. 
   - Run the installer and click "Next" through the standard setup.
2. **Install Python**: 
   - Go to [python.org](https://python.org/downloads/) and download the latest version.
   - **IMPORTANT (For Windows users):** During installation, make sure to check the box that says `"Add Python to PATH"` at the very bottom of the first screen before clicking Install.

---

## ⚙️ Step 2: Setup the AI Backend
The "backend" is the brain of the app that runs the Machine Learning model.

1. Open your computer's **Terminal** (Command Prompt or PowerShell on Windows, Terminal on Mac).
2. Navigate to the folder where you downloaded this project. If it's on your desktop, type:
   ```bash
   cd Desktop/Career-compass/backend
   ```
3. Create a "Virtual Environment" (a safe, isolated space for Python to install its files):
   - On **Windows**: type `python -m venv venv` and press Enter.
   - On **Mac/Linux**: type `python3 -m venv venv` and press Enter.
4. Activate the Virtual Environment:
   - On **Windows**: type `.\venv\Scripts\Activate` and press Enter.
   - On **Mac/Linux**: type `source venv/bin/activate` and press Enter.
5. Install the required Python libraries for the AI:
   ```bash
   pip install -r requirements.txt
   ```
6. Start the Backend Server:
   ```bash
   uvicorn main:app --reload
   ```
   *Keep this terminal window open! The backend is now running securely in the background at `http://localhost:8000`.*

---

## 💻 Step 3: Setup the Frontend Website
The "frontend" is the beautiful website you actually see and interact with.

1. Open a **brand new, second Terminal window** (keep the first one running!).
2. Navigate to the frontend folder:
   ```bash
   cd Desktop/Career-compass/frontend
   ```
3. Install the required libraries for the website:
   ```bash
   npm install
   ```
4. Start the website:
   ```bash
   npm run dev
   ```

---

## 🎉 Step 4: Open the App!
Both of your servers are now running! 
1. Open your favorite web browser (Chrome, Edge, Safari, etc.).
2. Go to this exact address: **[http://localhost:3000](http://localhost:3000)**
3. You should see the Career Compass landing page! Register a test profile, take the quiz, and explore your AI-powered career roadmap.
