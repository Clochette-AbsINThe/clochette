from pydantic import Field, validator

from app.core.config import DefaultModel
from app.schemas.out_of_stock_item import OutOfStockItem


class OutOfStockBase(DefaultModel):
    unit_price: float = Field(..., gt=0)


class OutOfStockCreate(OutOfStockBase):
    pass


class TransactionCreate(OutOfStockBase):
    pass


class OutOfStockUpdate(OutOfStockBase):
    pass


class OutOfStockBuy(OutOfStockBase):
    id: int
    item_id: int
    item: OutOfStockItemBuy = Field(..., exclude=True)
    
    name: str | None

    @validator('name')
    def populate_name(cls, v, values):
        return values['item'].name

    icon: str | None

    @validator('icon')
    def populate_icon(cls, v, values):
        return values['item'].icon

    class Config:
        orm_mode = True


class OutOfStockSell(OutOfStockBase):
    id: int
    item_id: int
    item: OutOfStockItemSell = Field(..., exclude=True)
    
    name: str | None

    @validator('name')
    def populate_name(cls, v, values):
        return values['item'].name
    
    icon: str | None

    @validator('icon')
    def populate_icon(cls, v, values):
        return values['item'].icon

    sell_price: float = Field(..., gt=0)

    class Config:
        orm_mode = True
