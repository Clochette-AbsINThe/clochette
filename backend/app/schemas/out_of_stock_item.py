from pydantic import ConfigDict, Field, computed_field

from app.core.types import IconName
from app.schemas.base import DefaultModel


class OutOfStockItemBase(DefaultModel):
    name: str = Field(..., min_length=1)
    icon: IconName
    sell_price: float | None = Field(default=None, gt=0)

    @computed_field  # type: ignore[misc]
    @property
    def buy_or_sell(self) -> bool:
        """buy_or_sell is True if the item does not have a sell price."""
        return self.sell_price is None


class OutOfStockItemCreate(OutOfStockItemBase):
    pass


class OutOfStockItemUpdate(OutOfStockItemBase):
    name: str | None = Field(default=None, min_length=1)
    icon: IconName | None = None


class OutOfStockItem(OutOfStockItemBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
