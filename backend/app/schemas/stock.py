from pydantic import BaseModel


class StockBase(BaseModel):
    pass


class StockCreate(StockBase):
    pass


class StockUpdate(StockBase):
    pass


class Stock(StockBase):
    id: int

    class Config:
        orm_mode = True
