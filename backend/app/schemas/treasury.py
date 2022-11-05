from app.core.config import DefaultModel

class TreasuryBase(DefaultModel):
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
