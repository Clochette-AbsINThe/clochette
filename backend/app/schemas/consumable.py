from pydantic import ConfigDict, Field, computed_field

from app.schemas.base import DefaultModel, ExcludedField
from app.schemas.consumable_item import ConsumableItem


class ConsumableBase(DefaultModel):
    """
    Base schema for a consumable item.

    Attributes:
    -----------
    unit_price : float
        The unit price of the consumable item, meaning the price of buy.
    sell_price : float
        The sell price of the consumable item, meaning the price of sell.
    """

    consumable_item_id: int = Field(..., alias="fkId")
    unit_price: float = Field(..., gt=0)
    sell_price: float = Field(..., gt=0)


class ConsumableCreate(ConsumableBase):
    id: int | None = None

    @computed_field  # type: ignore[misc]
    @property
    def empty(self) -> bool:
        return False


class TransactionCreate(ConsumableCreate):
    pass


class ConsumableUpdate(ConsumableBase):
    unit_price: float | None = Field(default=None, gt=0)
    sell_price: float | None = Field(default=None, gt=0)


class ConsumableCreatePurchase(ConsumableCreate):
    transaction_id_purchase: int = Field(0, alias="transaction_id")

    @computed_field  # type: ignore[misc]
    @property
    def empty(self) -> bool:
        return False


class ConsumableCreateSale(ConsumableCreate):
    transaction_id_sale: int = Field(0, alias="transaction_id")

    @computed_field  # type: ignore[misc]
    @property
    def empty(self) -> bool:
        return True


class Consumable(ConsumableBase):
    id: int
    consumable_item: ConsumableItem | None = ExcludedField
    empty: bool

    @computed_field  # type: ignore[misc]
    @property
    def name(self) -> str:
        return self.consumable_item.name if self.consumable_item else "N/A"

    @computed_field  # type: ignore[misc]
    @property
    def icon(self) -> str:
        return self.consumable_item.icon if self.consumable_item else "N/A"

    model_config = ConfigDict(from_attributes=True)
