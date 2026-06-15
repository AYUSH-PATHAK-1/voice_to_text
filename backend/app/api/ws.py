from fastapi import APIRouter, WebSocket
from app.services.websocket_manager import WebSocketManager

router = APIRouter()

@router.websocket("/ws/{job_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    job_id: str
):

    await websocket.accept()

    WebSocketManager.add(
        job_id,
        websocket
    )

    try:

        while True:
            await websocket.receive_text()

    except:

        WebSocketManager.remove(
            job_id
        )