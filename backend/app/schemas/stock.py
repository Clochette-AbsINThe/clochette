from app.core.config import DefaultModel


class StockBase(DefaultModel):
    pass


class StockCreate(StockBase):
    pass


class StockUpdate(StockBase):
    pass


class Stock(StockBase):
    id: int

    class Config:
        orm_mode = True
