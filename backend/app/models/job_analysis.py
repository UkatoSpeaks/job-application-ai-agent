import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import relationship
from app.db.base import Base

class JobAnalysis(Base):
    __tablename__ = "job_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    job_title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    location = Column(String, nullable=True)
    job_url = Column(String, nullable=True)
    match_score = Column(Float, nullable=False)
    similarity_score = Column(Float, nullable=True)
    matched_skills_count = Column(Integer, default=0)
    missing_skills_count = Column(Integer, default=0)
    result_data = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, server_default=func.now())

    user = relationship("User", backref="job_analyses")
