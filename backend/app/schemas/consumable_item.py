from enum import Enum
from pydantic import BaseModel


class IconName(str, Enum):
    glass = 'glass'
    beer = 'beer'
    food = 'food'
    soft = 'soft'
    barrel = 'barrel'
    misc = 'misc'

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
