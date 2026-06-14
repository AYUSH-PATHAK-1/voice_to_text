from backend.app.db.database import Base, engine

from backend.app.models.meeting import Meeting
from backend.app.models.transcript import Transcript
from backend.app.models.analysis import Analysis
from backend.app.models.key_point import KeyPoint
from backend.app.models.action_item import ActionItem
from backend.app.models.meeting_chunk import MeetingChunk


def init_db():
    Base.metadata.create_all(bind=engine)