import datetime

from pydantic import BaseModel

from app.core.types import PaymentMethod
from app.schemas.items import Item


class TransactionBase(BaseModel):
    payment_method: PaymentMethod
    sale: bool


class TransactionCreate(TransactionBase):
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
    