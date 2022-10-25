from pydantic import BaseModel, Field

from app.core.types import IconName


class OutOfStockItemBase(BaseModel):
    name: str = Field(..., min_length=1)
    icon: IconName


class OutOfStockItemBuyCreateFront(OutOfStockItemBase):
    pass


class OutOfStockItemBuyCreate(OutOfStockItemBase):
    buy_or_sell: bool
    sell_price: int | None = None


class OutOfStockItemBuyUpdateFront(OutOfStockItemBase):
    pass


class OutOfStockItemBuyUpdate(OutOfStockItemBase):
    buy_or_sell: bool
    sell_price: int | None = None


class OutOfStockItemBuy(OutOfStockItemBase):
    id: int

    class Config:
        orm_mode = True


class OutOfStockItemCreate(OutOfStockItemBase):
    pass


class OutOfStockItemUpdate(OutOfStockItemBase):
    pass


class OutOfStockItem(OutOfStockItemBase):
    id: int

    class Config:
        orm_mode = True
