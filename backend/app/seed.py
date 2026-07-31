from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.organization import Organization
from app.models.contract import Contract

db: Session = SessionLocal()

def seed_database():

    # Don't insert duplicate data
    if db.query(Organization).count() > 0:
        print("Database already seeded.")
        return

    org1 = Organization(
    name="ABC Technologies",
    code="ORG001",
    email="admin@abc.com",
    phone="+91-9876543210",
    address="Indore",
    status="ACTIVE"
)

    org2 = Organization(
    name="XYZ Solutions",
    code="ORG002",
    email="contact@xyz.com",
    phone="+91-9988776655",
    address="Bhopal",
    status="ACTIVE"
)

    db.add_all([org1, org2])

    db.commit()

    db.refresh(org1)
    db.refresh(org2)

    contracts = [

        Contract(
            organization_id=org1.id,
            status="DRAFT",
            field_data={
                "client_name": "Microsoft India",
                "po_ref_no": "PO-1001",
                "payment_terms": "30 Days"
            }
        ),

        Contract(
            organization_id=org1.id,
            status="FINALIZED",
            field_data={
                "client_name": "Infosys",
                "po_ref_no": "PO-1002",
                "payment_terms": "45 Days"
            }
        ),

        Contract(
            organization_id=org1.id,
            status="ARCHIVED",
            field_data={
                "client_name": "Google India",
                "po_ref_no": "PO-1003",
                "payment_terms": "60 Days"
            }
        ),

        Contract(
            organization_id=org2.id,
            status="FINALIZED",
            field_data={
                "client_name": "Amazon",
                "po_ref_no": "PO-2001",
                "payment_terms": "30 Days"
            }
        ),

        Contract(
            organization_id=org2.id,
            status="DRAFT",
            field_data={
                "client_name": "Netflix",
                "po_ref_no": "PO-2002",
                "payment_terms": "15 Days"
            }
        ),
    ]

    db.add_all(contracts)

    db.commit()

    print("Database seeded successfully.")

if __name__ == "__main__":
    seed_database()