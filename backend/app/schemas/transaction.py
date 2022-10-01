import datetime

from pydantic import BaseModel

from app.models.transaction import PaymentMethod


class TransactionBase(BaseModel):
    payment_method: PaymentMethod
    sale: str


class TransactionCreate(TransactionBase):
    datetime: datetime.datetime
    amount: float


class TransactionUpdate(TransactionBase):
    datetime: datetime.datetime
    amount: float


class Transaction(TransactionBase):
    id: int
    treasury_id: int
    datetime: datetime.datetime
    amount: float

    class Config:
        orm_mode = True
    