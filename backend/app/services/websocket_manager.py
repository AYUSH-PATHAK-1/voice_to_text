from fastapi import WebSocket


class WebSocketManager:

    connections = {}

    @classmethod
    def add(cls, job_id: str, websocket: WebSocket):
        cls.connections[job_id] = websocket

    @classmethod
    def remove(cls, job_id: str):
        cls.connections.pop(job_id, None)

    @classmethod
    async def send(cls, job_id: str, message: dict):

        websocket = cls.connections.get(job_id)

        if websocket:
            await websocket.send_json(message)