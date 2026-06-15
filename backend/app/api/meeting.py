from fastapi import APIRouter, HTTPException

from app.services.analysis_service import AnalysisService

router = APIRouter(
    prefix="/meetings",
    tags=["Meetings"]
)


@router.get("/")
async def get_meetings(
    page: int = 1,
    limit: int = 10,
    sentiment: str | None = None,
    meeting_type: str | None = None,
    search: str | None = None
):

    return AnalysisService.get_all_meetings(
    page=page,
    limit=limit,
    sentiment=sentiment,
    meeting_type=meeting_type,
    search=search
    )



@router.get("/{meeting_id}")
async def get_meeting(
    meeting_id: int
):

    meeting = AnalysisService.get_meeting_by_id(
        meeting_id
    )

    if not meeting:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found"
        )

    return meeting