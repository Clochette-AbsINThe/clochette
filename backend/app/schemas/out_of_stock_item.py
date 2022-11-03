from typing import Optional
from pydantic import BaseModel, Field, root_validator, validator

from app.core.types import IconName


class OutOfStockItemBase(BaseModel):
    name: str = Field(..., min_length=1)
    icon: IconName
    sell_price: Optional[float] = Field(default=None, gt=0, alias="sellPrice")

    class Config:
        allow_population_by_field_name = True


class OutOfStockItemCreate(OutOfStockItemBase):
    buy_or_sell: bool = None

    @validator("buy_or_sell", always=True, pre=True)
    def populate_buy_or_sell(cls, v, values):
        if values["sell_price"] is None:
            return True
        else:
            return False


class OutOfStockItemUpdate(OutOfStockItemBase):
    buy_or_sell: bool


class OutOfStockItem(OutOfStockItemBase):
    id: int

    class Config:
        orm_mode = True
