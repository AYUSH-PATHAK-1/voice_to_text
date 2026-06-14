from pydantic import BaseModel
from typing import List
from datetime import datetime


class AnalysisResponse(BaseModel):
    summary: str
    sentiment: str
    meeting_type: str
    key_points: List[str]
    action_items: List[str]


class MeetingDetailResponse(BaseModel):
    id: int
    original_filename: str
    saved_filename: str
    created_at: datetime

    transcript: str

    analysis: AnalysisResponse