from app.core.config import DefaultModel
from app.core.types import IconName


class ConsumableItemBase(DefaultModel):
    name: str
    icon: IconName


class ConsumableItemCreate(ConsumableItemBase):
    pass


class ConsumableItemUpdate(ConsumableItemBase):
    pass


class ConsumableItem(ConsumableItemBase):
    id: int

    class Config:
        orm_mode = True
