from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.db.database import Base


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)

    original_filename = Column(String, nullable=False)

    saved_filename = Column(String, nullable=False)

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )

    transcript = relationship(
        "Transcript",
        back_populates="meeting",
        uselist=False
    )

    analysis = relationship(
        "Analysis",
        back_populates="meeting",
        uselist=False
    )