# Contract Operations Console API

A backend application built with **FastAPI** and **PostgreSQL** for managing contracts in a **multi-tenant environment**. The application allows organizations to create, manage, and track contracts while maintaining complete audit history, enforcing contract validation, supporting contract lifecycle management, and providing real-time notifications through WebSockets.

---

# Features

## Multi-Tenant Architecture
- Organization-based data isolation using `organization_id`
- Organizations can access only their own contracts and audit history
- Cross-organization access is restricted

## Organization Management
- Create organizations
- List organizations
- Organization details include:
  - Name
  - Code
  - Email
  - Phone
  - Address
  - Status

## Contract Management
- Create Contract
- View Contract
- Update Contract
- Delete Contract
- Store flexible contract data using PostgreSQL JSONB

## Contract JSON Validation
Incoming contract payloads are validated using **Pydantic** before being stored.

Validation includes:

- Required client name
- Required PO reference number
- Valid purchase order date
- Quantity must be greater than zero
- Unit price cannot be negative
- At least one contract item is required
- Nested item validation

## Contract Lifecycle

Supported workflow:

```
DRAFT
   │
   ▼
FINALIZED
   │
   ▼
ARCHIVED
```

Invalid transitions return **409 Conflict**.

Examples

- DRAFT → FINALIZED ✅
- FINALIZED → ARCHIVED ✅
- DRAFT → ARCHIVED ❌
- ARCHIVED → FINALIZED ❌

## Audit Trail

Every important contract action automatically creates an immutable audit event.

Supported events:

- CREATED
- UPDATED
- STATUS_CHANGED
- DELETED

Each audit event stores:

- Contract ID
- Event Type
- Timestamp
- Changes

## Search, Filtering & Pagination

Supports:

- organization_id
- contract_id
- client_name
- status
- skip
- limit

## Real-Time Notifications

WebSocket support broadcasts contract status updates to all connected clients belonging to the same organization.

## Database

- PostgreSQL
- JSONB Contract Storage
- SQLAlchemy ORM
- Alembic Migrations

---

# Tech Stack

- Python 3.x
- FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic
- Pydantic v2
- Uvicorn
- WebSockets

---

# Project Structure

```text
backend/
│
├── app/
│   ├── crud/
│   ├── database/
│   ├── models/
│   ├── routers/
│   ├── schemas/
│   ├── services/
│   ├── websocket/
│   ├── utils/
│   ├── config.py
│   ├── database.py
│   ├── main.py
│   └── seed.py
│
├── alembic/
├── requirements.txt
├── .env
└── README.md
```

---

# Architecture

```
             Client
                │
                ▼
         FastAPI Routers
                │
                ▼
         Service Layer
                │
                ▼
            CRUD Layer
                │
                ▼
        SQLAlchemy ORM
                │
                ▼
          PostgreSQL
```

---

# Database Design

```
Organization
│
├── id
├── name
├── code
├── email
├── phone
├── address
├── status
│
└─────────────< Contract
                │
                ├── id
                ├── organization_id
                ├── status
                ├── field_data (JSONB)
                ├── created_at
                ├── updated_at
                │
                └─────────────< ContractEvent
                                 │
                                 ├── id
                                 ├── contract_id
                                 ├── event_type
                                 ├── changes
                                 ├── created_at
```

---

# Contract JSON Schema

Example payload

```json
{
  "organization_id": 1,
  "field_data": {
    "client_name": "ABC Pvt Ltd",
    "po_ref_no": "PO-1001",
    "po_date": "2026-07-29",
    "payment_terms": "30 Days",
    "delivery_terms": "FOB",
    "items": [
      {
        "description": "Laptop",
        "quantity": 10,
        "quantity_unit": "pcs",
        "unit_price": 50000,
        "pricing_unit": "per piece",
        "total": 500000
      }
    ]
  }
}
```

Validation Rules

| Field | Rule |
|-------|------|
| client_name | Required |
| po_ref_no | Required |
| po_date | Valid Date |
| quantity | > 0 |
| unit_price | >= 0 |
| items | Cannot be empty |

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone <repository-url>

cd Contract-Operations-Console
```

## 2. Create Virtual Environment

Windows

```bash
python -m venv venv
```

Activate

```bash
venv\Scripts\activate
```

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

## 4. Configure Environment

Create a `.env` file.

```env
DATABASE_URL=postgresql://username:password@localhost:5432/contract_db
```

## 5. Run Database Migrations

```bash
alembic upgrade head
```

## 6. Seed Sample Data

```bash
python -m app.seed
```

The seed script inserts:

- Sample Organizations
- Sample Contracts

Running multiple times will not create duplicates.

## 7. Run Server

```bash
uvicorn app.main:app --reload
```

Swagger UI

```
http://127.0.0.1:8000/docs
```

---

# API Endpoints

## Organizations

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /organizations | Create Organization |
| GET | /organizations | List Organizations |

---

## Contracts

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /contracts | Create Contract |
| GET | /contracts | List Contracts |
| GET | /contracts/{id} | Get Contract |
| PUT | /contracts/{id} | Update Contract |
| PATCH | /contracts/{id}/status | Update Contract Status |
| DELETE | /contracts/{id} | Delete Contract |
| GET | /contracts/{id}/events | Contract Audit History |

---

# Search & Filtering

Example

```
GET /contracts?organization_id=1&status=DRAFT&client_name=ABC&skip=0&limit=10
```

Supported filters

- organization_id
- contract_id
- client_name
- status
- skip
- limit

---

# Multi-Tenancy

Contracts are isolated using `organization_id`.

Each organization can:

- Create its own contracts
- View its own contracts
- Update its own contracts
- Delete its own contracts
- View only its own audit history

Requests for another organization's data return **404 Not Found**.

---

# Audit Trail

Every important contract operation creates an audit record.

Supported audit events:

- CREATED
- UPDATED
- STATUS_CHANGED
- DELETED

Audit history:

```
GET /contracts/{contract_id}/events
```

---

# WebSocket

Connection URL

```
ws://localhost:8000/ws/contracts/{organization_id}
```

Example

```
ws://localhost:8000/ws/contracts/1
```

Example notification

```json
{
    "event": "STATUS_CHANGED",
    "contract_id": 5,
    "organization_id": 1,
    "old_status": "DRAFT",
    "new_status": "FINALIZED"
}
```

---

# HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 404 | Resource Not Found |
| 409 | Invalid Status Transition |
| 422 | Validation Error |
| 500 | Internal Server Error |

---
