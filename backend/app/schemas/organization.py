from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, EmailStr


class OrganizationStatus(str, Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"


class OrganizationCreate(BaseModel):
    name: str
    code: str
    email: EmailStr
    phone: str
    address: str
    status: OrganizationStatus = OrganizationStatus.ACTIVE


class OrganizationUpdate(BaseModel):
    name: str | None = None
    code: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    address: str | None = None
    status: OrganizationStatus | None = None


class OrganizationResponse(BaseModel):
    id: int
    name: str
    code: str
    email: EmailStr
    phone: str
    address: str
    status: OrganizationStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)