from fastapi import APIRouter

from backend.app.schemas.insight import InsightRequest
from backend.app.services.insight_service import InsightService

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