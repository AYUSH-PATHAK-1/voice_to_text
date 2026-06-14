from pydantic import BaseModel
from datetime import datetime


class MeetingListItem(BaseModel):
    id: int
    original_filename: str
    sentiment: str
    meeting_type: str
    created_at: datetime