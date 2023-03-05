import datetime

from pydantic import validator

from app.core.config import DefaultModel
from app.core.types import PaymentMethod, TransactionType
from app.schemas.barrel import Barrel
from app.schemas.consumable import Consumable
from app.schemas.glass import Glass
from app.schemas.item import Item
from app.schemas.out_of_stock import OutOfStock


class TransactionBase(DefaultModel):
    datetime: datetime.datetime
    payment_method: PaymentMethod
    sale: bool
    amount: float
    type: TransactionType = TransactionType.transaction
    description: str | None

    @validator('amount')
    def amount_must_have_two_decimals(cls, v):
        return round(v, 2)


class TransactionCreate(TransactionBase):
    treasury_id: int = 1


class TransactionFrontCreate(TransactionBase):
    items: list[Item] = []

    @validator('items')
    def empty_only_if_tresorery_type(cls, v, values):
        if v == [] and values['type'] != TransactionType.tresorery:
            raise ValueError('items must be provided if type is not "tresorery"')
        return v


class TransactionUpdate(TransactionBase):
    pass


class Transaction(TransactionBase):
    id: int
    treasury_id: int

    class Config:
        orm_mode = True


class TransactionSingle(Transaction):
    barrels: list[Barrel] | None
    glasses: list[Glass] | None
    out_of_stocks: list[OutOfStock] | None
    consumables_purchase: list[Consumable] | None
    consumables_sale: list[Consumable] | None

    class Config:
        exclude_none = True
    