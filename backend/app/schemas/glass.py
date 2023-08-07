from pydantic import ConfigDict, Field, computed_field

from app.schemas.barrel import Barrel
from app.schemas.base import DefaultModel, ExcludedField


class GlassBase(DefaultModel):
    barrel_id: int = Field(..., alias="fkId")


class GlassCreate(GlassBase):
    transaction_id: int = 0


class TransactionCreate(GlassBase):
    pass


class GlassUpdate(GlassBase):
    pass


class Glass(GlassBase):
    id: int
    barrel: Barrel | None = ExcludedField

    @computed_field  # type: ignore[misc]
    @property
    def name(self) -> str:
        return self.barrel.name if self.barrel else "N/A"

    @computed_field  # type: ignore[misc]
    @property
    def sell_price(self) -> float:
        return self.barrel.sell_price if self.barrel else 0.0

    model_config = ConfigDict(from_attributes=True)
