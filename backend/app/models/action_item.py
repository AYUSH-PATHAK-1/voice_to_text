from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base


class ActionItem(Base):
    __tablename__ = "action_items"

    id = Column(Integer, primary_key=True)

    analysis_id = Column(
        Integer,
        ForeignKey("analyses.id")
    )

    item = Column(Text)

    analysis = relationship(
        "Analysis",
        back_populates="action_items"
    )