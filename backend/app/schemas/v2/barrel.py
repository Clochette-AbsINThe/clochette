from pydantic import ConfigDict, Field, computed_field

from app.schemas.base import DefaultModel, ExcludedField
from app.schemas.drink_item import DrinkItem


class BarrelBase(DefaultModel):
    pass


class BarrelCreate(BarrelBase):
    drink_item_id: int
    sell_price: float = Field(..., gt=0)
    buy_price: float = Field(..., gt=0)
    transaction_id_purchase: int = Field(..., alias="transactionId")

    @computed_field  # type: ignore[misc]
    @property
    def empty_or_solded(self) -> bool:
        return False

    @computed_field  # type: ignore[misc]
    @property
    def is_mounted(self) -> bool:
        return False


class BarrelUpdate(BarrelBase):
    pass


class BarrelUpdateModify(BarrelUpdate):
    sell_price: float | None = Field(default=None, gt=0)
    empty_or_solded: bool | None = Field(default=None)
    is_mounted: bool | None = None


class BarrelUpdateSale(BarrelUpdate):
    barrel_sell_price: float = Field(..., gt=0)
    transaction_id_sale: int = Field(..., alias="transactionId")

    @computed_field  # type: ignore[misc]
    @property
    def empty_or_solded(self) -> bool:
        """This property is used to know if the barrel is solded or not."""
        return True

    @computed_field  # type: ignore[misc]
    @property
    def is_mounted(self) -> bool:
        """When the barrel is solded, it is no longer mounted."""
        return False


class Barrel(BarrelBase):
    id: int
    drink_item_id: int
    drink_item: DrinkItem | None = ExcludedField

    buy_price: float
    sell_price: float
    barrel_sell_price: float | None
    empty_or_solded: bool
    is_mounted: bool

    @computed_field  # type: ignore[misc]
    @property
    def name(self) -> str:
        return self.drink_item.name if self.drink_item else "N/A"

    model_config = ConfigDict(from_attributes=True)


class BarrelDistinct(Barrel):
    quantity: int = 1
