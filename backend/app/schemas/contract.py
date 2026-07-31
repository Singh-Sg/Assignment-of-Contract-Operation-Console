from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field

class ContractItem(BaseModel):
    description: str

    quantity: float = Field(
        ...,
        gt=0,
        description="Quantity must be greater than 0"
    )

    quantity_unit: Optional[str] = None

    unit_price: float = Field(
        ...,
        ge=0,
        description="Unit price cannot be negative"
    )

    pricing_unit: Optional[str] = None

    total: Optional[float] = None

class ContractFieldData(BaseModel):
    client_name: str

    po_ref_no: str

    po_date: date

    payment_terms: Optional[str] = None

    delivery_terms: Optional[str] = None

    items: list[ContractItem] = Field(
        ...,
        min_length=1
    )

class ContractBase(BaseModel):
    field_data: ContractFieldData

class ContractCreate(ContractBase):
    organization_id: int

class ContractUpdate(BaseModel):
    field_data: ContractFieldData

class ContractStatusUpdate(BaseModel):
    status: str

class ContractResponse(ContractBase):
    id: int
    organization_id: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True