from sqlalchemy.orm import Session

from app.models.contract_event import ContractEvent

from pydantic import BaseModel

def create_contract_event(
    db: Session,
    contract_id: int,
    event_type: str,
    changes,
):
    if isinstance(changes, BaseModel):
        changes = changes.model_dump(mode="json")

    event = ContractEvent(
        contract_id=contract_id,
        event_type=event_type,
        changes=changes,
    )

    db.add(event)
    db.commit()
    db.refresh(event)

    return event

def get_contract_events(
    db: Session,
    contract_id: int,
):
    return (
        db.query(ContractEvent)
        .filter(ContractEvent.contract_id == contract_id)
        .order_by(ContractEvent.event_time.asc())
        .all()
    )