from pydantic import Field, PrivateAttr

from app.core.config import DefaultModel
from app.schemas.consumable_item import ConsumableItem


class ConsumableBase(DefaultModel):
    unit_price: float = Field(..., gt=0)
    sell_price: float = Field(..., gt=0)
    empty: bool


class ConsumableCreate(ConsumableBase):
    pass


class ConsumableUpdate(ConsumableBase):
    pass


class Consumable(ConsumableBase):
    id: int
    consumable_item_id: int
    _consumable_item: ConsumableItem = PrivateAttr(default_factory=ConsumableItem)
    name: str
    icon: str

    def __init__(self, **data):
        super().__init__(**data)
        self.name = self._consumable_item.default_factory().name
        self.icon = self._consumable_item.default_factory().icon

    class Config:
        orm_mode = True
