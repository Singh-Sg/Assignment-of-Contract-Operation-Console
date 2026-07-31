from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.websocket.manager import manager
import asyncio
from app.crud.contract import (
    create_contract,
    get_contract_by_id,
    update_contract,
    update_status,
    get_contracts_by_organization,
    delete_contract,
)
from app.schemas.contract import ContractFieldData
from app.crud.contract_event import create_contract_event, get_contract_events

VALID_STATUS_TRANSITIONS = {
    "DRAFT": ["FINALIZED"],
    "FINALIZED": ["ARCHIVED"],
    "ARCHIVED": []
}

def validate_contract_organization(
    contract,
    organization_id: int,
):
    if contract.organization_id != organization_id:
        raise HTTPException(
            status_code=404,
            detail="Contract not found"
        )

def create_new_contract(db: Session, contract_data):
    contract = create_contract(db, contract_data)

    create_contract_event(
        db=db,
        contract_id=contract.id,
        event_type="CREATED",
        changes=contract.field_data
    )

    return contract

def validate_status_transition(current, new):

    allowed = VALID_STATUS_TRANSITIONS[current]

    if new not in allowed:
        raise HTTPException(
            status_code=409,
            detail=f"Cannot change status from {current} to {new}"
        )

async def change_contract_status(
    db: Session,
    contract_id: int,
    organization_id: int,
    new_status: str
):

    contract = get_contract_by_id(db, contract_id)

    if contract is None:
            raise HTTPException(
                status_code=404,
                detail="Contract not found"
            )
    
    validate_contract_organization(
    contract,
    organization_id
    )

    old_status = contract.status

    validate_status_transition(
        old_status,
        new_status
    )

    contract = update_status(
        db,
        contract,
        new_status
    )

    create_contract_event(
        db=db,
        contract_id=contract.id,
        event_type="STATUS_CHANGED",
        changes={
            "old_status": old_status,
            "new_status": new_status
        }
    )

    await manager.broadcast(
        organization_id=contract.organization_id,
        message={
            "event": "STATUS_CHANGED",
            "contract_id": contract.id,
            "organization_id": contract.organization_id,
            "old_status": old_status,
            "new_status": contract.status,
        },
    )

    return contract    

def update_existing_contract(
    db: Session,
    contract_id: int,
    organization_id: int,
    field_data: ContractFieldData,
):
    field_data_json = field_data.model_dump(mode="json")
    contract = get_contract_by_id(db, contract_id)
    validate_contract_organization(
    contract,
    organization_id
    )
    if contract is None:
        raise HTTPException(
            status_code=404,
            detail="Contract not found"
        )

    updated_contract = update_contract(
        db=db,
        contract=contract,
        field_data=field_data
    )

    create_contract_event(
        db=db,
        contract_id=updated_contract.id,
        event_type="UPDATED",
        changes=field_data.model_dump(mode="json")
    )

    return updated_contract

def get_contract_history(
    db: Session,
    contract_id: int,
    organization_id: int,
):
    contract = get_contract_by_id(db, contract_id)
    validate_contract_organization(
    contract,
    organization_id
    )
    if contract is None:
        raise HTTPException(
            status_code=404,
            detail="Contract not found"
        )

    return get_contract_events(
        db,
        contract_id,
    )

def get_organization_contracts(
    db: Session,
    organization_id: int,
    status: str | None = None,
    client_name: str | None = None,
    contract_id: int | None = None,
    skip: int = 0,
    limit: int = 10,
):
    return get_contracts_by_organization(
        db=db,
        organization_id=organization_id,
        status=status,
        client_name=client_name,
        contract_id=contract_id,
        skip=skip,
        limit=limit,
    )

def delete_existing_contract(
    db: Session,
    contract_id: int,
    organization_id: int,
):
    contract = get_contract_by_id(db, contract_id)

    if contract is None:
        raise HTTPException(
            status_code=404,
            detail="Contract not found",
        )

    validate_contract_organization(
        contract,
        organization_id,
    )

    if contract.status != "DRAFT":
        raise HTTPException(
            status_code=409,
            detail="Only draft contracts can be deleted",
        )

    create_contract_event(
        db=db,
        contract_id=contract.id,
        event_type="DELETED",
        changes={
            "status": contract.status
        },
    )

    delete_contract(
        db=db,
        contract=contract,
    )

    return {
        "message": "Contract deleted successfully"
    }