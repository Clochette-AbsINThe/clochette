import datetime

from app.core.config import DefaultModel
from app.core.types import PaymentMethod
from app.schemas.barrel import Barrel
from app.schemas.consumable import Consumable
from app.schemas.glass import Glass
from app.schemas.item import Item
from app.schemas.out_of_stock import OutOfStock


class TransactionBase(DefaultModel):
    payment_method: PaymentMethod
    sale: bool


class TransactionCreate(TransactionBase):
    treasury_id: int = 1
    datetime: datetime.datetime
    amount: float


class TransactionFrontCreate(TransactionBase):
    datetime: datetime.datetime
    amount: float
    items: list[Item]


class TransactionUpdate(TransactionBase):
    pass


class Transaction(TransactionBase):
    id: int
    treasury_id: int
    datetime: datetime.datetime
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
    