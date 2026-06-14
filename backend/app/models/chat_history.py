import uuid
from sqlalchemy import Column, Integer, Text, DateTime, String
from datetime import datetime

from backend.app.db.database import Base


class ChatHistory(Base):

    __tablename__ = "chat_history"

    id = Column(String, primary_key=True,default=lambda: str(uuid.uuid4()))

    meeting_id = Column(Integer, nullable=True)

    role = Column(Text)  # user / assistant

    message = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)