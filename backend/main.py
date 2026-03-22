from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import pickle
import os

import models, schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Career Compass API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML Model
model_path = os.path.join(os.path.dirname(__file__), 'ml', 'model.pkl')
if os.path.exists(model_path):
    with open(model_path, 'rb') as f:
        career_model = pickle.load(f)
else:
    career_model = None
    print("WARNING: ML model not found. Run train_model.py first.")

# Static Data setup for MVP
CAREERS_DB = [
    {"id": 1, "domain": "Software", "title": "Software Engineer", "description": "Build software systems.", "skills": ["Coding", "Analytical"], "salary": "$80,000 - $130,000", "growth": "+22% (High demand)"},
    {"id": 2, "domain": "Design", "title": "UI/UX Designer", "description": "Design user interfaces.", "skills": ["Creative", "Communication"], "salary": "$65,000 - $105,000", "growth": "+12% (Steady)"},
    {"id": 3, "domain": "Finance", "title": "Financial Analyst", "description": "Analyze financial data.", "skills": ["Analytical", "Communication"], "salary": "$70,000 - $115,000", "growth": "+9% (Stable)"},
    {"id": 4, "domain": "Healthcare", "title": "Medical Professional", "description": "Provide healthcare services.", "skills": ["Analytical", "Social"], "salary": "$90,000 - $150,000+", "growth": "+16% (Very High)"},
    {"id": 5, "domain": "Engineering", "title": "Mechanical Engineer", "description": "Design mechanical systems.", "skills": ["Analytical", "Realistic"], "salary": "$75,000 - $110,000", "growth": "+6% (Moderate)"},
    {"id": 6, "domain": "Marketing", "title": "Marketing Manager", "description": "Manage marketing campaigns.", "skills": ["Communication", "Enterprising"], "salary": "$60,000 - $100,000", "growth": "+10% (Steady)"},
    {"id": 7, "domain": "Education", "title": "Teacher / Educator", "description": "Educate students.", "skills": ["Communication", "Social"], "salary": "$45,000 - $75,000", "growth": "+5% (Stable)"},
    {"id": 8, "domain": "Civil Services", "title": "Civil Servant", "description": "Work in government admin.", "skills": ["Analytical", "Social"], "salary": "$50,000 - $90,000 (Benefits)", "growth": "Stable govt posting"}
]

SCHOLARSHIPS_DB = [
    {"id": 1, "name": "Merit Tech Scholarship", "domain_match": "Software", "min_score": 85, "amount": "$5,000", "deadline": "2026-08-01"},
    {"id": 2, "name": "Creative Minds Grant", "domain_match": "Design", "min_score": 75, "amount": "$3,000", "deadline": "2026-07-15"},
    {"id": 3, "name": "Future Healers Award", "domain_match": "Healthcare", "min_score": 90, "amount": "$10,000", "deadline": "2026-09-01"},
    {"id": 4, "name": "General Excellence", "domain_match": "All", "min_score": 95, "amount": "$2,000", "deadline": "2026-10-01"}
]

@app.post("/api/users/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/api/users/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/api/assessment/submit")
def submit_assessment(quiz: schemas.QuizSubmit, db: Session = Depends(get_db)):
    # Save assessment
    db_assessment = models.Assessment(**quiz.dict())
    db.add(db_assessment)
    db.commit()

    # Get user for combined features
    user = db.query(models.User).filter(models.User.id == quiz.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if career_model is None:
        return {"error": "ML model not loaded"}

    # Prepare features for prediction
    coding = user.skills.get("coding", 0) if isinstance(user.skills, dict) else 0
    comm = user.skills.get("communication", 0) if isinstance(user.skills, dict) else 0
    analytical = user.skills.get("analytical", 0) if isinstance(user.skills, dict) else 0
    creative = user.skills.get("creative", 0) if isinstance(user.skills, dict) else 0

    features = [[
        user.academic_score,
        coding,
        comm,
        analytical,
        creative,
        quiz.R, quiz.I, quiz.A, quiz.S, quiz.E, quiz.C
    ]]

    # Predict
    domain_pred = career_model.predict(features)[0]
    
    # Get top probabilities
    probs = career_model.predict_proba(features)[0]
    classes = career_model.classes_
    
    # Sort by probability
    domain_probs = list(zip(classes, probs))
    domain_probs.sort(key=lambda x: x[1], reverse=True)
    
    top_3_domains = [d[0] for d in domain_probs[:3]]
    top_3_scores = [d[1] for d in domain_probs[:3]]

    return {
        "recommended_domains": top_3_domains,
        "confidence_scores": top_3_scores
    }

@app.get("/api/careers")
def get_careers(domain: str = None):
    if domain:
        return [c for c in CAREERS_DB if c["domain"] == domain or domain in c["domain"]]
    return CAREERS_DB

@app.get("/api/scholarships")
def get_scholarships(academic_score: float, domain: str = None):
    matches = []
    for s in SCHOLARSHIPS_DB:
        if academic_score >= s["min_score"]:
            if s["domain_match"] == "All" or s["domain_match"] == domain:
                matches.append(s)
    return matches
