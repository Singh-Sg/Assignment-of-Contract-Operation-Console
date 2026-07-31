from fastapi import WebSocket
from collections import defaultdict


class ConnectionManager:
    def __init__(self):
        # organization_id -> list of websocket connections
        self.active_connections: dict[int, list[WebSocket]] = defaultdict(list)

    async def connect(
        self,
        websocket: WebSocket,
        organization_id: int,
    ):
        await websocket.accept()
        self.active_connections[organization_id].append(websocket)

    def disconnect(
        self,
        websocket: WebSocket,
        organization_id: int,
    ):
        if websocket in self.active_connections[organization_id]:
            self.active_connections[organization_id].remove(websocket)

        # Cleanup empty organization entries
        if not self.active_connections[organization_id]:
            del self.active_connections[organization_id]

    async def broadcast(
        self,
        organization_id: int,
        message: dict,
    ):
        connections = self.active_connections.get(organization_id, [])

        for connection in connections:
            await connection.send_json(message)

manager = ConnectionManager()