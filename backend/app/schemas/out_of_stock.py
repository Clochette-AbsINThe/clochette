from pydantic import BaseModel


class OutOfStockBase(BaseModel):
    price: float


class OutOfStockCreate(OutOfStockBase):
    pass


class OutOfStockUpdate(OutOfStockBase):
    pass


class OutOfStock(OutOfStockBase):
    id: int
    transaction_id: int
    item_id: int
    price: float

    class Config:
        orm_mode = True