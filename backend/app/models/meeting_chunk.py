from sqlalchemy import (
    Column,
    Integer,
    Text,
    ForeignKey
)

from sqlalchemy.orm import relationship

from pgvector.sqlalchemy import Vector

from backend.app.db.database import Base


class MeetingChunk(Base):

    __tablename__ = "meeting_chunks"

    id = Column(
        Integer,
        primary_key=True
    )

    meeting_id = Column(
        Integer,
        ForeignKey("meetings.id")
    )

    chunk_index = Column(
        Integer,
        nullable=False
    )

    chunk_text = Column(
        Text,
        nullable=False
    )

    embedding = Column(
        Vector(3072)
    )

    meeting = relationship(
        "Meeting"
    )