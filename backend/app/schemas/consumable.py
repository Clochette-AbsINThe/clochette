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
    sale: bool

    # transaction_id_purchase sould be use if sale is False
    # transaction_id_sale sould be use if sale is True
    transaction_id_purchase: int | None = None
    transaction_id_sale: int | None = None

    @root_validator(pre=True)
    def check_transaction_id(cls, values):
        if values['sale'] is True:
            values['transaction_id_sale'] = Field(..., alias='transaction_id')
        else:
            values['transaction_id_purchase'] = Field(..., alias='transaction_id')
        return values

    class Config:
        exclude_none = True
        exclude = {'sale'}


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
