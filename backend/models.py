from sqlalchemy import Column, Integer, String, Float, JSON
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    age = Column(Integer)
    education_level = Column(String)
    academic_score = Column(Float)
    interests = Column(JSON) # Store as list of strings
    skills = Column(JSON) # Store dict of skill: score (0-10)

class Assessment(Base):
    __tablename__ = "assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    R = Column(Float)
    I = Column(Float)
    A = Column(Float)
    S = Column(Float)
    E = Column(Float)
    C = Column(Float)
