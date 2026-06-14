from fastapi import APIRouter
from backend.app.services.analytics_service import AnalyticsService

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/overview")
async def analytics_overview():
    return AnalyticsService.get_overview()


@router.get("/meeting-types")
async def meeting_types():
    return AnalyticsService.meeting_types()

@router.get("/action-items")
async def action_items():
    return AnalyticsService.action_items()

@router.get("/topics")
async def topics():
    return AnalyticsService.topics()

@router.get("/recent-meetings")
async def recent_meetings():
    return AnalyticsService.recent_meetings()