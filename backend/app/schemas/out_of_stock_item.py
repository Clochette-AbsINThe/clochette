from typing import Optional
from pydantic import Field, validator

from app.core.config import DefaultModel
from app.core.types import IconName


class OutOfStockItemBase(DefaultModel):
    name: str = Field(..., min_length=1)
    icon: IconName
    sell_price: Optional[float] = Field(default=None, gt=0)


class OutOfStockItemCreate(OutOfStockItemBase):
    buy_or_sell: Optional[bool]

    @validator("buy_or_sell", always=True, pre=True)
    def populate_buy_or_sell(cls, v, values):
        return values["sell_price"] is None


class OutOfStockItemCreateFront(OutOfStockItemBase):
    pass


class OutOfStockItemUpdate(OutOfStockItemBase):
    buy_or_sell: Optional[bool]

    # Exclude_unset option removing dynamic default setted on a validator #1399,
    # We had to fix the value of buy_or_sell in the endpoint for now.
    @validator("buy_or_sell", always=True, pre=True)
    def populate_buy_or_sell(cls, v, values):
        return values["sell_price"] is None


class OutOfStockItemUpdateFront(OutOfStockItemBase):
    pass


class OutOfStockItem(OutOfStockItemBase):
    id: int

    class Config:
        orm_mode = True
