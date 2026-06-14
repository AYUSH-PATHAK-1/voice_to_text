from pydantic import BaseModel
from typing import List


class MeetingAnalysis(BaseModel):
    summary: str
    key_points: List[str]
    action_items: List[str]
    sentiment: str
    meeting_type: str
    confidence_score: float