from pydantic import ConfigDict, Field, computed_field

from app.schemas.base import DefaultModel, ExcludedField
from app.schemas.drink_item import DrinkItem


class BarrelBase(DefaultModel):
    drink_item_id: int | None = Field(default=None, alias="fkId")
    sell_price: float = Field(..., gt=0)
    buy_price: float = Field(..., gt=0, alias="unitPrice")


class BarrelCreate(BarrelBase):
    transaction_v1_id: int = Field(default=0, alias="transaction_id")

    @computed_field  # type: ignore[misc]
    @property
    def empty_or_solded(self) -> bool:
        return False

    @computed_field  # type: ignore[misc]
    @property
    def is_mounted(self) -> bool:
        return False


class TransactionCreate(BarrelCreate):
    """Used to create a transaction."""


class BarrelUpdate(BarrelBase):
    drink_item_id: int | None = Field(default=None, alias="fkId")
    empty_or_solded: bool | None = Field(default=False, alias="empty")
    is_mounted: bool | None = False
    sell_price: float | None = Field(default=None, gt=0)
    buy_price: float | None = Field(default=None, gt=0, alias="unitPrice")


class Barrel(BarrelBase):
    id: int
    drink_item: DrinkItem | None = ExcludedField
    empty_or_solded: bool = Field(..., alias="empty")
    is_mounted: bool

    @computed_field  # type: ignore[misc]
    @property
    def name(self) -> str:
        return self.drink_item.name if self.drink_item else "N/A"

    model_config = ConfigDict(from_attributes=True)
