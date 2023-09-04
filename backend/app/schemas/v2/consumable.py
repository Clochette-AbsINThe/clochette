from pydantic import ConfigDict, Field, computed_field

from app.core.types import IconName
from app.schemas.base import DefaultModel, ExcludedField
from app.schemas.consumable_item import ConsumableItem


class ConsumableBase(DefaultModel):
    pass


class ConsumableCreate(ConsumableBase):
    consumable_item_id: int

    sell_price: float = Field(..., gt=0)
    buy_price: float = Field(..., gt=0)

    transaction_id_purchase: int = Field(0, alias="transactionId")

    @computed_field  # type: ignore[misc]
    @property
    def solded(self) -> bool:
        return False


class ConsumableUpdate(ConsumableBase):
    pass


class ConsumableUpdateModify(ConsumableUpdate):
    sell_price: float | None = Field(default=None, gt=0)


class ConsumableUpdateSale(ConsumableUpdate):
    transaction_id_sale: int = Field(0, alias="transactionId")

    @computed_field  # type: ignore[misc]
    @property
    def solded(self) -> bool:
        return True


class Consumable(ConsumableBase):
    id: int
    consumable_item_id: int
    consumable_item: ConsumableItem | None = ExcludedField

    solded: bool
    sell_price: float
    buy_price: float

    @computed_field  # type: ignore[misc]
    @property
    def name(self) -> str:
        return self.consumable_item.name if self.consumable_item else "N/A"

    @computed_field  # type: ignore[misc]
    @property
    def icon(self) -> IconName:
        return self.consumable_item.icon if self.consumable_item else IconName.MISC

    model_config = ConfigDict(from_attributes=True)
