from pydantic import Field

from app.core.config import DefaultModel

class TreasuryBase(DefaultModel):
    total_amount: float
    cash_amount: float = Field(..., gt=0)


class TreasuryCreate(TreasuryBase):
    pass


class TreasuryUpdate(TreasuryBase):
    class Config:
        orm_mode = True


class Treasury(TreasuryBase):
    id: int

    class Config:
        orm_mode = True
