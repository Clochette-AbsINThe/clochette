from pydantic import Field

from app.core.config import DefaultModel

class TreasuryBase(DefaultModel):
    total_amount: float
    cash_amount: float = Field(..., ge=0)
    lydia_rate: float = Field(..., ge=0, le=1)


class TreasuryCreate(TreasuryBase):
    pass


class TreasuryUpdate(TreasuryBase):
    total_amount: float = Field(exclude=True)
    cash_amount: float = Field(exclude=True)
    lydia_rate: float | None = Field(ge=0, le=1)
    class Config:
        orm_mode = True


class Treasury(TreasuryBase):
    id: int

    class Config:
        orm_mode = True
