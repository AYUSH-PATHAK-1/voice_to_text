from pydantic import BaseModel


class AnalyticsOverviewResponse(BaseModel):
    total_meetings: int
    positive_meetings: int
    neutral_meetings: int
    negative_meetings: int