from pydantic import ConfigDict, Field

from app.schemas.base import DefaultModel


class TreasuryBase(DefaultModel):
    total_amount: float
    cash_amount: float = Field(..., ge=0)
    lydia_rate: float = Field(..., ge=0, le=1)


class TreasuryCreate(TreasuryBase):
    pass


class InternalTreasuryUpdate(TreasuryBase):
    model_config = ConfigDict(from_attributes=True)


class TreasuryUpdate(DefaultModel):
    lydia_rate: float | None = Field(default=None, ge=0, le=1)


class Treasury(TreasuryBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
