# Career Compass

**Career Compass** is an AI-based Career Exploration and Scholarship Recommendation System. It uses a custom Machine Learning model to evaluate a student's psychometric traits (RIASEC model), academic scores, and self-assessed skills to map them to the perfect career domains while recommending tailored scholarships.

## Features
- **AI Career Predictions**: Uses a Scikit-Learn Random Forest model to predict Top Careers.
- **Interactive Psychometric Quiz**: Assesses personality based on the RIASEC theory.
- **Dynamic Skill Gap Analysis**: Visually compares user skills to a career's ideal profile via an interactive Radar Chart.
- **AI Career Guide Chatbot**: Context-aware floating assistant to answer career-related questions.
- **Actionable Roadmaps**: Automatically generates a 4-phase step-by-step learning path.
- **Job Market Insights**: Live data on average salaries and demand growth.
- **PDF Report Generation**: Download personalized results formatting neatly for print.

## Tech Stack
- **Frontend**: Next.js (App Router), TailwindCSS, Recharts, Lucide-React
- **Backend**: FastAPI (Python), SQLite, SQLAlchemy
- **Machine Learning**: Scikit-Learn, Pandas, Numpy

---

## Getting Started

### Prerequisites
- [Node.js (v18+)](https://nodejs.org/) installed
- [Python (3.9+)](https://python.org/) installed
- Git installed

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/Career-compass.git
cd Career-compass
```

### 2. Setup the Backend (FastAPI + ML)
Open a terminal and navigate to the `backend` folder:
```bash
cd backend
```

Create a virtual environment and activate it:
```bash
# On Windows
python -m venv venv
.\venv\Scripts\Activate

# On Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

Install the dependencies:
```bash
pip install -r requirements.txt
```

*(Optional)* Regenerate the synthetic dataset and retrain the ML model:
```bash
python ml/train_model.py
```

Start the backend server:
```bash
uvicorn main:app --reload
```
The backend API will now be running on `http://localhost:8000`.

### 3. Setup the Frontend (Next.js)
Open a **new** terminal and navigate to the `frontend` folder:
```bash
cd frontend
```

Install the Node dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

### 4. Open the App
Navigate to **[http://localhost:3000](http://localhost:3000)** in your browser to experience Career Compass!
