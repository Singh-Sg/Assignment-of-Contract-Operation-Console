from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class ContractEvent(Base):
    __tablename__ = "contract_events"

    id = Column(Integer, primary_key=True, index=True)

    contract_id = Column(
        Integer,
        ForeignKey("contracts.id", ondelete="CASCADE"),
        nullable=False
    )

    event_type = Column(
        String,
        nullable=False
    )

    changes = Column(
        JSONB,
        nullable=True
    )

    event_time = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    contract = relationship(
        "Contract",
        back_populates="events"
    )