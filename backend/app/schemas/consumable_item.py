from pydantic import BaseModel

from app.core.types import IconName


class ConsumableItemBase(BaseModel):
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
