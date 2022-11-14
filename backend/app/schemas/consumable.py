from pydantic import Field, validator

from app.core.config import DefaultModel
from app.schemas.consumable_item import ConsumableItem


class ConsumableBase(DefaultModel):
    unit_price: float = Field(..., ge=0)
    sell_price: float = Field(..., ge=0)
    empty: bool


class ConsumableCreate(ConsumableBase):
    pass


class TransactionCreate(ConsumableBase):
    pass


class ConsumableUpdate(ConsumableBase):
    pass


class Consumable(ConsumableBase):
    id: int
    consumable_item: ConsumableItem = Field(..., exclude=True)
    name: str | None

    @validator('name', always=True)
    def populate_name(cls, v, values):
        return values['consumable_item'].name

    icon: str | None

    @validator('icon', always=True)
    def populate_icon(cls, v, values):
        return values['consumable_item'].icon

    class Config:
        orm_mode = True
