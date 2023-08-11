from typing import cast

from pydantic import ConfigDict, Field, computed_field, model_validator

from app.core.types import IconName
from app.schemas.base import DefaultModel, ExcludedField
from app.schemas.out_of_stock_item import OutOfStockItem


class OutOfStockBase(DefaultModel):
    item_id: int = Field(..., alias="fkId")
    unit_price: float | None = Field(default=None, gt=0)


class OutOfStockCreate(OutOfStockBase):
    transaction_id: int = 0


class TransactionCreate(OutOfStockBase):
    pass


class OutOfStockUpdate(OutOfStockBase):
    pass


class OutOfStock(OutOfStockBase):
    id: int
    item: OutOfStockItem | None = ExcludedField

    @computed_field  # type: ignore[misc]
    @property
    def name(self) -> str:
        return self.item.name if self.item else "N/A"

    @computed_field  # type: ignore[misc]
    @property
    def icon(self) -> IconName:
        return self.item.icon if self.item else IconName.MISC

    @computed_field  # type: ignore[misc]
    @property
    def sell_price(self) -> float | None:
        return self.item.sell_price if self.item else None

    @model_validator(mode="after")
    @classmethod
    def validate_sell_price_or_unit_price(cls, _model):
        model = cast(OutOfStock, _model)
        unit_price = model.unit_price
        sell_price = model.sell_price
        if sell_price is not None and unit_price is not None:
            raise ValueError("Cannot have both sell_price and unit_price")
        if sell_price is None and unit_price is None:
            raise ValueError("Must have either sell_price or unit_price")
        return _model

    model_config = ConfigDict(from_attributes=True)
