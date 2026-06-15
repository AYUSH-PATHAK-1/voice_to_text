from fastapi import APIRouter

from app.schemas.insight import InsightRequest
from app.services.insight_service import InsightService

router = APIRouter(
    prefix="/insights",
    tags=["Insights"]
)


@router.post("/")
async def generate_insight(
    request: InsightRequest
):

    return (
        InsightService.generate_insight(
            request.question
        )
    )