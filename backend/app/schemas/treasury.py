from pydantic import BaseModel


class TreasuryBase(BaseModel):
    total_amount: float
    cash_amount: float


class TreasuryCreate(TreasuryBase):
    pass


class TreasuryUpdate(TreasuryBase):
    pass


class Treasury(TreasuryBase):
    id: int

    class Config:
        orm_mode = True
