from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from backend.app.db.database import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True)

    meeting_id = Column(
        Integer,
        ForeignKey("meetings.id")
    )

    summary = Column(Text)

    sentiment = Column(String)

    meeting_type = Column(String)

    meeting = relationship(
        "Meeting",
        back_populates="analysis"
    )

    key_points = relationship(
        "KeyPoint",
        back_populates="analysis"
    )

    action_items = relationship(
        "ActionItem",
        back_populates="analysis"
    )