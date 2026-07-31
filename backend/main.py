from fastapi import FastAPI
from app.routers.organization import router as organization_router
from app.routers.contract import router as contract_router
from fastapi import WebSocket, WebSocketDisconnect
from app.websocket.manager import manager
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Contract Operations Console API",
    version="1.0.0"
)

# origins = [
#     "http://localhost:5173/",
#     "http://127.0.0.1:5173",
# ]

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws/contracts/{organization_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    organization_id: int,
):
    await manager.connect(
        websocket,
        organization_id,
    )

    try:
        while True:
            # Client se message receive karte rahenge
            await websocket.receive_text()

    except WebSocketDisconnect:
        manager.disconnect(
            websocket,
            organization_id,
        )

app.include_router(organization_router)
app.include_router(contract_router)

@app.get("/")
def health():
    return {
        "message": "Contract Operations Console API is running."
    }