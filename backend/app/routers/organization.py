from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.organization import (
    OrganizationCreate,
    OrganizationResponse,
)
from app.crud.organization import (
    create_organization,
    get_all_organizations,
)

router = APIRouter(
    prefix="/organizations",
    tags=["Organizations"],
)

@router.post(
    "",
    response_model=OrganizationResponse,
    status_code=201,
)
def create_new_organization(
    organization: OrganizationCreate,
    db: Session = Depends(get_db),
):
    return create_organization(db, organization)

@router.get(
    "",
    response_model=list[OrganizationResponse],
)
def list_organizations(
    db: Session = Depends(get_db),
):
    return get_all_organizations(db)