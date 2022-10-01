from pydantic import BaseModel


class OutOfStockItemBase(BaseModel):
    name: str
    sale: bool


class OutOfStockItemCreate(OutOfStockItemBase):
    pass


class OutOfStockItemUpdate(OutOfStockItemBase):
    pass


class OutOfStockItem(OutOfStockItemBase):
    id: int

    class Config:
        orm_mode = True
