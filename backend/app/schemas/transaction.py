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
    type: TransactionType = TransactionType.transaction
    description: str | None


class TransactionCreate(TransactionBase):
    treasury_id: int = 1
    amount: float


class TransactionFrontCreate(TransactionBase):
    amount: float
    items: list[Item] | None

    @validator('items')
    def none_only_if_tresorery_type(cls, v, values):
        if v is None and values['type'] != TransactionType.tresorery:
            raise ValueError('items must be provided if type is not "tresorery"')


class TransactionUpdate(TransactionBase):
    pass


class Transaction(TransactionBase):
    id: int
    treasury_id: int
    amount: float

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
    