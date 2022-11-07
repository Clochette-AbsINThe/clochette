from pydantic import Field, PrivateAttr

from app.core.config import DefaultModel
from app.schemas.out_of_stock_item import OutOfStockItem


class OutOfStockBase(DefaultModel):
    unit_price: float = Field(..., gt=0)


class OutOfStockCreate(OutOfStockBase):
    pass


class OutOfStockUpdate(OutOfStockBase):
    pass


class OutOfStockBuy(OutOfStockBase):
    id: int
    item_id: int
    _item: OutOfStockItem = PrivateAttr(default_factory=OutOfStockItem)
    name: str
    icon: str

    def __init__(self, **data):
        super().__init__(**data)
        self.name = self._item.default_factory().name
        self.icon = self._item.default_factory().icon

    class Config:
        orm_mode = True


class OutOfStockSell(OutOfStockBase):
    id: int
    item_id: int
    _item: OutOfStockItem = PrivateAttr(default_factory=OutOfStockItem)
    name: str
    icon: str
    sell_price: float = Field(..., gt=0)

    def __init__(self, **data):
        super().__init__(**data)
        self.name = self._item.default_factory().name
        self.icon = self._item.default_factory().icon
        self.sell_price = self._item.default_factory().sell_price

    class Config:
        orm_mode = True
