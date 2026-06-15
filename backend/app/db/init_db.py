from app.db.database import Base, engine

from app.models.meeting import Meeting
from app.models.transcript import Transcript
from app.models.analysis import Analysis
from app.models.key_point import KeyPoint
from app.models.action_item import ActionItem
from app.models.meeting_chunk import MeetingChunk


def init_db():
    Base.metadata.create_all(bind=engine)