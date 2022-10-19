from enum import Enum
from pydantic import BaseModel


class IconName(str, Enum):
    glass = 'Glass'
    beer = 'Beer'
    food = 'Food'
    soft = 'Soft'
    barrel = 'Barrel'
    misc = 'Misc'

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
