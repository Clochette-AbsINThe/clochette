from pydantic import ConfigDict, Field, PrivateAttr, computed_field

from app.core.types import IconName, TradeType
from app.schemas.base import DefaultModel, ExcludedField
from app.schemas.v2.non_inventoried_item import NonInventoriedItem


class NonInventoriedBase(DefaultModel):
    non_inventoried_item_id: int
    buy_price: float | None = Field(default=None, gt=0)


class NonInventoriedCreate(NonInventoriedBase):
    transaction_id: int

    _sell_price: float | None = PrivateAttr(default=None)

    @computed_field  # type: ignore[misc]
    @property
    def sell_price(self) -> float | None:
        return self._sell_price

    @sell_price.setter
    def sell_price(self, value: float | None) -> None:
        self._sell_price = value


class NonInventoriedUpdate(NonInventoriedBase):
    pass


class NonInventoried(NonInventoriedBase):
    id: int
    non_inventoried_item: NonInventoriedItem | None = ExcludedField
    sell_price: float | None

    @computed_field  # type: ignore[misc]
    @property
    def name(self) -> str:
        return self.non_inventoried_item.name if self.non_inventoried_item else "N/A"

    @computed_field  # type: ignore[misc]
    @property
    def icon(self) -> IconName:
        return (
            self.non_inventoried_item.icon
            if self.non_inventoried_item
            else IconName.MISC
        )

    @computed_field  # type: ignore[misc]
    @property
    def trade(self) -> TradeType:
        return (
            self.non_inventoried_item.trade
            if self.non_inventoried_item
            else TradeType.PURCHASE
        )

    model_config = ConfigDict(from_attributes=True)
