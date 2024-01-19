from pydantic import ConfigDict, Field, computed_field

from app.core.types import IconName, TradeType
from app.schemas.base import DefaultModel


class NonInventoriedItemBase(DefaultModel):
    name: str = Field(..., min_length=1)
    icon: IconName
    sell_price: float | None = Field(default=None, gt=0)


class NonInventoriedItemCreate(NonInventoriedItemBase):
    @computed_field  # type: ignore[misc]
    @property
    def trade(self) -> TradeType:
        if self.sell_price is None:
            return TradeType.PURCHASE
        return TradeType.SALE


class NonInventoriedItemUpdate(NonInventoriedItemBase):
    name: str | None = Field(default=None, min_length=1)
    icon: IconName | None = None

    @computed_field  # type: ignore[misc]
    @property
    def trade(self) -> TradeType | None:
        # Check if sell_price has been set by user and not filled by default value.
        # pylint: disable=unsupported-membership-test
        if "sell_price" in self.model_fields_set:
            if self.sell_price is None:
                return TradeType.PURCHASE
            return TradeType.SALE
        return None


class NonInventoriedItem(NonInventoriedItemBase):
    id: int
    trade: TradeType

    model_config = ConfigDict(from_attributes=True)
