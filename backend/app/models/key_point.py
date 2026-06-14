from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship

from backend.app.db.database import Base


class KeyPoint(Base):
    __tablename__ = "key_points"

    id = Column(Integer, primary_key=True)

    analysis_id = Column(
        Integer,
        ForeignKey("analyses.id")
    )

    point = Column(Text)

    analysis = relationship(
        "Analysis",
        back_populates="key_points"
    )