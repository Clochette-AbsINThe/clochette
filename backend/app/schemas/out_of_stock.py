from pydantic import BaseModel


class OutOfStockBase(BaseModel):
    unit_price: float


class OutOfStockCreate(OutOfStockBase):
    pass


class OutOfStockUpdate(OutOfStockBase):
    pass


class OutOfStock(OutOfStockBase):
    id: int
    transaction_id: int
    item_id: int

    class Config:
        orm_mode = True