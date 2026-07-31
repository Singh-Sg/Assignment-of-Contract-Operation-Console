from sqlalchemy.orm import Session
from app.models.organization import Organization
from app.schemas.organization import OrganizationCreate

def create_organization(db: Session, organization: OrganizationCreate):
    db_organization = Organization(
        name=organization.name,
        code=organization.code,
        email=organization.email,
        phone=organization.phone,
        address=organization.address,
        status=organization.status
    )

    db.add(db_organization)
    db.commit()
    db.refresh(db_organization)

    return db_organization

def get_all_organizations(db: Session):
    return db.query(Organization).all()

def get_organization_by_id(db: Session, organization_id: int):
    return (
        db.query(Organization)
        .filter(Organization.id == organization_id)
        .first()
    )