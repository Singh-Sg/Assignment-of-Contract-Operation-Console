from datetime import datetime
from typing import Any

from pydantic import BaseModel

class ContractEventResponse(BaseModel):
    id: int
    contract_id: int
    event_type: str
    changes: dict[str, Any]
    event_time: datetime

    class Config:
        from_attributes = True