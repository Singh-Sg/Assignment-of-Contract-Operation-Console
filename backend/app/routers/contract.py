from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.contract import ContractUpdate

from app.database import get_db
from app.schemas.contract_event import ContractEventResponse
from app.schemas.contract import (
    ContractCreate,
    ContractResponse,
    ContractStatusUpdate,
)

from app.services.contract_service import (
    create_new_contract,
    change_contract_status,
    update_existing_contract,
    get_contract_history,
    delete_existing_contract,
)

from app.crud.contract import (
    get_contract_by_id,
    get_contracts_by_organization,
)

router = APIRouter(
    prefix="/contracts",
    tags=["Contracts"],
)

@router.post(
    "",
    response_model=ContractResponse,
    status_code=201,
)
def create_contract_api(
    contract: ContractCreate,
    db: Session = Depends(get_db),
):
    return create_new_contract(db, contract)

@router.get(
    "/{contract_id}",
    response_model=ContractResponse,
)
def get_contract(
    contract_id: int,
    organization_id: int,
    db: Session = Depends(get_db),
):

    contract = get_contract_by_id(db, contract_id)

    if contract is None:
        raise HTTPException(
            status_code=404,
            detail="Contract not found",
        )
    
    if contract.organization_id != organization_id:
        raise HTTPException(
            status_code=404,
            detail="Contract not found"
        )
    
    return contract

@router.get(
    "",
    response_model=list[ContractResponse]
)
def list_contracts(
    organization_id: int,
    status: str | None = None,
    client_name: str | None = None,
    contract_id: int | None = None,
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
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

@router.patch(
    "/{contract_id}/status",
    response_model=ContractResponse,
)
async def update_contract_status(
    contract_id: int,
    status_data: ContractStatusUpdate,
    organization_id: int,
    db: Session = Depends(get_db),
):
    return await change_contract_status(
        db,
        contract_id,
        organization_id,
        status_data.status,
    )

@router.get(
    "/{contract_id}/events",
    response_model=list[ContractEventResponse],
)
def get_contract_events_api(
    contract_id: int,
    organization_id: int,
    db: Session = Depends(get_db),
):
    return get_contract_history(
        db=db,
        contract_id=contract_id,
        organization_id=organization_id,
    )

@router.put(
    "/{contract_id}",
    response_model=ContractResponse,
)
def update_contract(
    contract_id: int,
    contract: ContractUpdate,
    organization_id: int,
    db: Session = Depends(get_db),
):
    return update_existing_contract(
        db=db,
        contract_id=contract_id,
        organization_id=organization_id,
        field_data=contract.field_data,
    )

@router.delete(
    "/{contract_id}",
    status_code=200,
)
def delete_contract_api(
    contract_id: int,
    organization_id: int,
    db: Session = Depends(get_db),
):
    return delete_existing_contract(
        db=db,
        contract_id=contract_id,
        organization_id=organization_id,
    )