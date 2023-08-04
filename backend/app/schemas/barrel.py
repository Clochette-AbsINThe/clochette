from pydantic import ConfigDict, Field, computed_field

from app.schemas.base import DefaultModel, ExcludedField
from app.schemas.drink import Drink


class BarrelBase(DefaultModel):
    drink_id: int | None = Field(..., alias="fkId")
    sell_price: float = Field(..., gt=0)
    unit_price: float = Field(..., gt=0)


class BarrelCreate(BarrelBase):
    transaction_id: int = 0

    @computed_field  # type: ignore[misc]
    @property
    def empty(self) -> bool:
        return False

    @computed_field  # type: ignore[misc]
    @property
    def is_mounted(self) -> bool:
        return False


class TransactionCreate(BarrelCreate):
    """Used to create a transaction."""


class BarrelUpdate(BarrelBase):
    drink_id: int | None = Field(default=None, alias="fkId")
    empty: bool | None = False
    is_mounted: bool | None = False
    sell_price: float | None = Field(default=None, gt=0)
    unit_price: float | None = Field(default=None, gt=0)


class Barrel(BarrelBase):
    id: int
    drink: Drink | None = ExcludedField
    empty: bool
    is_mounted: bool

    @computed_field  # type: ignore[misc]
    @property
    def name(self) -> str:
        return self.drink.name if self.drink else "N/A"

    model_config = ConfigDict(from_attributes=True)
