[README (2).md](https://github.com/user-attachments/files/30581593/README.2.md)
# Contract Operations Console

A full-stack **Contract Operations Console** built with **FastAPI**, **PostgreSQL**, **React**, and **Vite**. The application supports multi-tenant contract management, contract lifecycle tracking, audit history, JSON validation, and real-time notifications using WebSockets.

---

# Features

## Multi-Tenant Architecture

- Organization-based data isolation
- Contracts scoped by `organization_id`
- Secure organization-specific access
- Independent audit history per organization

---

## Organization Management

- Create organizations
- View organizations
- Store organization details:
  - Name
  - Code
  - Email
  - Phone
  - Address
  - Status

---

## Contract Management

- Create contracts
- View contracts
- Update contracts
- Delete contracts
- Flexible JSONB contract storage
- Upload contract data using JSON files

---

## Contract Validation

Incoming contract payloads are validated using **Pydantic v2**.

Validation includes:

- Required client name
- Required PO reference number
- Valid purchase order date
- Quantity greater than zero
- Non-negative unit price
- At least one contract item
- Nested object validation

---

## Contract Lifecycle

```
DRAFT
   │
   ▼
FINALIZED
   │
   ▼
ARCHIVED
```

Allowed transitions

- DRAFT → FINALIZED
- FINALIZED → ARCHIVED

Invalid transitions return **409 Conflict**.

---

## Audit Trail

Every important contract action automatically creates an immutable audit event.

Supported events:

- CREATED
- UPDATED
- STATUS_CHANGED
- DELETED

Each event stores:

- Contract ID
- Event Type
- Timestamp
- Changes

---

## Search, Filtering & Pagination

Supports filtering by:

- Organization
- Contract ID
- Client Name
- Status

Pagination

- skip
- limit

---

## Real-Time Notifications

Supports WebSocket notifications.

Connected users of the same organization receive updates instantly whenever contracts are created, updated, deleted, or their status changes.

---

# Tech Stack

## Frontend

- React 19
- Vite
- Material UI (MUI)
- MUI DataGrid
- MUI Timeline
- React Router DOM
- Axios
- React Hook Form
- Zod
- Context API
- Native WebSockets

---

## Backend

- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic
- Pydantic v2
- Uvicorn
- WebSockets

---

# Project Structure

```
Contract-Operations-Console
│
├── backend
│   ├── app
│   │   ├── crud
│   │   ├── database
│   │   ├── models
│   │   ├── routers
│   │   ├── schemas
│   │   ├── services
│   │   ├── websocket
│   │   ├── utils
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── main.py
│   │   └── seed.py
│   │
│   ├── alembic
│   ├── requirements.txt
│   └── .env
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── .env
│
└── README.md
```

---

# Architecture

```
                 React Frontend
                       │
                 REST API / WebSocket
                       │
                  FastAPI Routers
                       │
                  Service Layer
                       │
                    CRUD Layer
                       │
                  SQLAlchemy ORM
                       │
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

# Setup

## Clone Repository

```bash
git clone <repository-url>
cd Contract-Operations-Console
```

---

# Backend Setup

## Create Virtual Environment

```bash
cd backend

python -m venv venv
```

Activate

Windows

```bash
venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Create `.env`

```env
DATABASE_URL=postgresql://username:password@localhost:5432/contract_db
```

Run migrations

```bash
alembic upgrade head
```

Seed sample data

```bash
python -m app.seed
```

Run backend

```bash
python -m uvicorn app.main:app --reload
```

Backend URL

```
http://localhost:8000
```

Swagger

```
http://localhost:8000/docs
```

---

# Frontend Setup

```bash
cd frontend
```

Install packages

```bash
npm install
```

Create `.env`

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_BASE_URL=ws://localhost:8000
```

Run frontend

```bash
npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

# API Endpoints

## Organizations

| Method | Endpoint |
|---------|----------|
| POST | /organizations |
| GET | /organizations |

---

## Contracts

| Method | Endpoint |
|---------|----------|
| POST | /contracts |
| GET | /contracts |
| GET | /contracts/{id} |
| PUT | /contracts/{id} |
| PATCH | /contracts/{id}/status |
| DELETE | /contracts/{id} |
| GET | /contracts/{id}/events |

---

# Search

```
GET /contracts?organization_id=1&status=DRAFT&client_name=ABC&skip=0&limit=10
```

Supports:

- organization_id
- contract_id
- client_name
- status
- skip
- limit

---

# WebSocket

Connection

```
ws://localhost:8000/ws/contracts/{organization_id}
```

Example

```
ws://localhost:8000/ws/contracts/1
```

Example message

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

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 404 | Not Found |
| 409 | Invalid Status Transition |
| 422 | Validation Error |
| 500 | Internal Server Error |

---

# Future Enhancements

- JWT Authentication
- Role-Based Access Control
- File Attachments
- Contract Versioning
- Email Notifications
- Dashboard Analytics
- Docker Deployment
- CI/CD Pipeline
