from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, relationship

from app.core.types import IconName, TradeType
from app.db.base_class import Base, Str256

if TYPE_CHECKING:  # pragma: no cover
    from .non_inventoried import NonInventoried


class NonInventoriedItem(Base):
    """
    Represents an item which will not appears in the stock.
    (e.g. product not to sold, or to sold separately from the buy)

    Attributes:
        - `name` is the name of the item.
        - `trade` is the type of trade of the item. (purchase or sale)
        - `icon` is the icon of the item.
        - `sell_price` is the price of sell of the item if it is meant to be sold.
    """

    name: Mapped[Str256]
    trade: Mapped[TradeType]
    icon: Mapped[IconName]
    sell_price: Mapped[float | None]

    non_inventorieds: Mapped[list["NonInventoried"]] = relationship(
        back_populates="non_inventoried_item", lazy="selectin"
    )
