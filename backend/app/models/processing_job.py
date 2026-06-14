import uuid
from sqlalchemy import Column, Integer, Text, String
from backend.app.db.database import Base


class ProcessingJob(Base):

    __tablename__ = "processing_jobs"

    id = Column(String, primary_key=True,default=lambda: str(uuid.uuid4()))

    meeting_id = Column(Integer)

    status = Column(String, default="pending")
    # pending | processing | completed | failed

    error = Column(Text, nullable=True)