from abc import ABC, abstractmethod
from datetime import datetime as _datetime

from pydantic import ConfigDict, PrivateAttr, computed_field, field_validator

from app.core.types import PaymentMethod, Status, TradeType, TransactionType
from app.schemas.base import DefaultModel
from app.schemas.glass import Glass
from app.schemas.v2.barrel import Barrel
from app.schemas.v2.consumable import Consumable
from app.schemas.v2.non_inventoried import NonInventoried


class TransactionBase(DefaultModel):
    datetime: _datetime
    payment_method: PaymentMethod
    trade: TradeType


class TransactionCreate(TransactionBase, ABC):
    @property
    @abstractmethod
    def type(self) -> TransactionType:
        """The type of the transaction."""

    @property
    @abstractmethod
    def status(self) -> Status:
        """The status of the transaction."""

    _treasury_id: int = PrivateAttr(default=0)

    @computed_field  # type: ignore[misc]
    @property
    def treasury_id(self) -> int:
        return self._treasury_id

    @treasury_id.setter
    def treasury_id(self, value: int):
        self._treasury_id = value


class TransactionTreasuryCreate(TransactionCreate):
    amount: float
    description: str

    @computed_field  # type: ignore[misc]
    @property
    def type(self) -> TransactionType:
        """In Treasury, the type is always TRESORERY."""
        return TransactionType.TRESORERY

    @computed_field  # type: ignore[misc]
    @property
    def status(self) -> Status:
        """In Treasury, the status is VALIDATED at first."""
        return Status.VALIDATED

    @field_validator("amount", mode="after")
    @classmethod
    def amount_must_have_two_decimals(cls, v):
        return round(v, 2)


class TransactionCommerceCreate(TransactionCreate):
    @computed_field  # type: ignore[misc]
    @property
    def type(self) -> TransactionType:
        """In Commerce, the type is always TRANSACTION."""
        return TransactionType.COMMERCE

    @computed_field  # type: ignore[misc]
    @property
    def status(self) -> Status:
        """In Commerce, the status is PENDING at first."""
        return Status.PENDING

    @computed_field  # type: ignore[misc]
    @property
    def amount(self) -> float:
        """In Commerce, the amount is always 0 at first."""
        return 0


class TransactionUpdate(DefaultModel):
    _amount: float = PrivateAttr(default=0)

    @computed_field  # type: ignore[misc]
    @property
    def amount(self) -> float:
        return self._amount

    @amount.setter
    def amount(self, value: float):
        self._amount = value


class TransactionCommerceUpdate(TransactionUpdate):
    @computed_field  # type: ignore[misc]
    @property
    def status(self) -> Status:
        """In Commerce, the status is VALIDATED when updated."""
        return Status.VALIDATED


class Transaction(TransactionBase):
    id: int
    treasury_id: int

    type: TransactionType
    status: Status

    amount: float | None
    description: str | None

    model_config = ConfigDict(from_attributes=True)


class TransactionDetail(Transaction):
    barrels_purchase: list[Barrel]
    barrels_sale: list[Barrel]
    glasses: list[Glass]
    non_inventorieds: list[NonInventoried]
    consumables_purchase: list[Consumable]
    consumables_sale: list[Consumable]
