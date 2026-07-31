from sqlalchemy.orm import Session
from sqlalchemy import cast, String
from app.models.contract import Contract
from app.schemas.contract import ContractCreate, ContractFieldData

def create_contract(db: Session, contract: ContractCreate):
    db_contract = Contract(
        organization_id=contract.organization_id,
        field_data=contract.field_data.model_dump(mode="json"),
    )

    db.add(db_contract)
    db.commit()
    db.refresh(db_contract)

    return db_contract

def get_contract_by_id(db: Session, contract_id: int):
    return (
        db.query(Contract)
        .filter(Contract.id == contract_id)
        .first()
    )

def get_contracts_by_organization(
    db: Session,
    organization_id: int,
    status: str | None = None,
    client_name: str | None = None,
    contract_id: int | None = None,
    skip: int = 0,
    limit: int = 10,
):
    query = db.query(Contract).filter(
        Contract.organization_id == organization_id
    )

    # Search by Contract ID
    if contract_id:
        query = query.filter(
            Contract.id == contract_id
        )

    # Filter by Status
    if status:
        query = query.filter(
            Contract.status == status
        )

    # Partial Search by Client Name (JSONB)
    if client_name:
        query = query.filter(
            cast(
                Contract.field_data["client_name"].astext,
                String
            ).ilike(f"%{client_name}%")
        )

    return (
        query
        .order_by(Contract.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

def update_contract(
    db: Session,
    contract: Contract,
    field_data: ContractFieldData
):
    contract.field_data = field_data.model_dump(mode="json")

    db.commit()
    db.refresh(contract)

    return contract

def update_status(
    db: Session,
    contract: Contract,
    status: str
):
    contract.status = status

    db.commit()
    db.refresh(contract)

    return contract

def delete_contract(
    db: Session,
    contract: Contract
):
    db.delete(contract)
    db.commit()