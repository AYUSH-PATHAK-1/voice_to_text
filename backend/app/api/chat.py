from fastapi import APIRouter

from backend.app.schemas.chat import ChatRequest
from backend.app.services.chat_service import ChatService

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


@router.post("/global")
async def chat(
    request: ChatRequest
):
    return ChatService.chat(
        request.question
    )

@router.post("/meeting/{meeting_id}")
async def chat_with_meeting(
    meeting_id: int,
    request: ChatRequest
):
    return ChatService.chat_with_meeting(
        meeting_id,
        request.question
    )