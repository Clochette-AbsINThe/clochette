from typing import Optional
from pydantic import Field, validator

from app.core.config import DefaultModel
from app.schemas.out_of_stock_item import OutOfStockItem


class OutOfStockBase(DefaultModel):
    item_id: int = Field(..., alias='fkId')

    unit_price: Optional[float] = Field(default=None, gt=0)


class OutOfStockCreate(OutOfStockBase):
    pass


class TransactionCreate(OutOfStockBase):
    pass


class OutOfStockUpdate(OutOfStockBase):
    pass


class OutOfStock(OutOfStockBase):
    id: int
    item: OutOfStockItem = Field(..., exclude=True)

    name: str | None

    @validator('name', always=True)
    def populate_name(cls, v, values):
        return values['item'].name

    icon: str | None

    @validator('icon', always=True)
    def populate_icon(cls, v, values):
        return values['item'].icon

    sell_price: Optional[float] = Field(default=None)

    @validator('sell_price', always=True)
    def populate_sell_price(cls, v, values):
        return values['item'].sell_price

    class Config:
        orm_mode = True
