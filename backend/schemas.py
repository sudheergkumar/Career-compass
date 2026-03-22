from pydantic import BaseModel
from typing import List, Dict, Optional

class UserCreate(BaseModel):
    name: str
    age: int
    education_level: str
    academic_score: float
    interests: List[str]
    skills: Dict[str, float]

class UserResponse(UserCreate):
    id: int

    class Config:
        from_attributes = True

class QuizSubmit(BaseModel):
    user_id: int
    R: float
    I: float
    A: float
    S: float
    E: float
    C: float

class RecommendationResponse(BaseModel):
    recommended_domains: List[str]
    confidence_scores: List[float]
