from pydantic import ConfigDict, Field, PrivateAttr, computed_field

from app.schemas.barrel import Barrel
from app.schemas.base import DefaultModel, ExcludedField


class GlassBase(DefaultModel):
    barrel_id: int


class GlassCreate(GlassBase):
    transaction_id: int

    _transaction_sell_price: float = PrivateAttr(default=0)

    @computed_field  # type: ignore[misc]
    @property
    def transaction_sell_price(self) -> float:
        return self._transaction_sell_price

    @transaction_sell_price.setter
    def transaction_sell_price(self, value: float):
        self._transaction_sell_price = value


class GlassUpdate(GlassBase):
    pass


class Glass(GlassBase):
    id: int
    barrel: Barrel | None = ExcludedField
    transaction_sell_price: float = Field(..., alias="sellPrice")

    @computed_field  # type: ignore[misc]
    @property
    def name(self) -> str:
        return self.barrel.name if self.barrel else "N/A"

    model_config = ConfigDict(from_attributes=True)
