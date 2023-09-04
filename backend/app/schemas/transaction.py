from datetime import datetime as _datetime

from pydantic import ConfigDict, FieldValidationInfo, computed_field, field_validator

from app.core.types import PaymentMethod, TransactionTypeV1
from app.schemas.barrel import Barrel
from app.schemas.base import DefaultModel
from app.schemas.consumable import Consumable
from app.schemas.glass import Glass
from app.schemas.item import Item
from app.schemas.out_of_stock import OutOfStock


class TransactionBase(DefaultModel):
    datetime: _datetime
    payment_method: PaymentMethod
    sale: bool
    amount: float
    type: TransactionTypeV1 = TransactionTypeV1.TRANSACTION
    description: str | None = None

    @field_validator("amount")
    @classmethod
    def amount_must_have_two_decimals(cls, v):
        if v is not None:
            return round(v, 2)
        return v


class TransactionCreate(TransactionBase):
    @computed_field  # type: ignore[misc]
    @property
    def treasury_id(self) -> int:
        """In v1, the treasury_id is always 1."""
        return 1


class TransactionFrontCreate(TransactionBase):
    items: list[Item] = []

    @field_validator("items")
    @classmethod
    def empty_only_if_tresorery_type(cls, v, info: FieldValidationInfo):
        values = info.data
        if v == [] and values["type"] != TransactionTypeV1.TRESORERY:
            raise ValueError('items must be provided if type is not "tresorery"')
        return v


class TransactionUpdate(TransactionBase):
    pass


class Transaction(TransactionBase):
    id: int
    treasury_id: int

    model_config = ConfigDict(from_attributes=True)


class TransactionSingle(Transaction):
    barrels: list[Barrel] | None
    glasses: list[Glass] | None
    out_of_stocks: list[OutOfStock] | None
    consumables_purchase: list[Consumable] | None
    consumables_sale: list[Consumable] | None
