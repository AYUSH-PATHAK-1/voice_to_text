from pydantic import BaseModel


class InsightOutput(BaseModel):
    main_insight: str
    top_topics: list[str]
    recommendations: list[str]
    confidence_score: int
    overall_sentiment: str
    meeting_count: int