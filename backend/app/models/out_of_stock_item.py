from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, relationship

from app.core.types import IconName
from app.db.base_class import Base, Str256

if TYPE_CHECKING:  # pragma: no cover
    from .out_of_stock import OutOfStock


class OutOfStockItem(Base):
    """
    Represents an item which will not appears in the stock.
    (e.g. product not to sold, or to sold separately)

    `buy_or_sell` is a boolean which indicates if the item is meant to be bought or sold.
        - True means buy (The `sell_price` will be None)
        - False means sell (The `sell_price` will be a float)
    """

    name: Mapped[Str256]
    buy_or_sell: Mapped[bool]
    icon: Mapped[IconName]
    sell_price: Mapped[float | None]

    outofstocks: Mapped[list["OutOfStock"]] = relationship(
        back_populates="item",
        lazy="selectin",
    )
