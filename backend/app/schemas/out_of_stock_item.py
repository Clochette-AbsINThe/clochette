from pydantic import BaseModel, Field

from app.core.types import IconName


class OutOfStockItemBase(BaseModel):
    name: str = Field(..., min_length=1)
    icon: IconName


class OutOfStockItemBuyCreateFront(OutOfStockItemBase):
    pass


class OutOfStockItemBuyCreate(OutOfStockItemBase):
    buy_or_sell: bool
    sell_price: float | None = None


class OutOfStockItemBuyUpdateFront(OutOfStockItemBase):
    pass


class OutOfStockItemBuyUpdate(OutOfStockItemBase):
    buy_or_sell: bool = True
    sell_price: float | None = None


class OutOfStockItemBuy(OutOfStockItemBase):
    id: int

    class Config:
        orm_mode = True


class OutOfStockItemSellCreateFront(OutOfStockItemBase):
    sell_price: float = Field(..., gt=0)


class OutOfStockItemSellCreate(OutOfStockItemBase):
    buy_or_sell: bool = False
    sell_price: float


class OutOfStockItemSellUpdateFront(OutOfStockItemBase):
    sell_price: float = Field(..., gt=0)


class OutOfStockItemSellUpdate(OutOfStockItemBase):
    buy_or_sell: bool = False
    sell_price: float


class OutOfStockItemSell(OutOfStockItemBase):
    id: int
    sell_price: int

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
