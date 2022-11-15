from pydantic import Field, root_validator, validator

from app.core.config import DefaultModel
from app.schemas.consumable_item import ConsumableItem


class ConsumableBase(DefaultModel):
    consumable_item_id: int = Field(..., alias='fkId')
    unit_price: float = Field(..., gt=0)
    sell_price: float = Field(..., gt=0)
    empty: bool


class ConsumableCreate(ConsumableBase):
    id: int | None = None

    class Config:
        exclude_none = True


class ConsumableCreatePurchase(ConsumableCreate):
    transaction_id_purchase: int = Field(0, alias='transaction_id')


class ConsumableCreateSale(ConsumableCreate):
    transaction_id_sale: int = Field(0, alias='transaction_id')


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
