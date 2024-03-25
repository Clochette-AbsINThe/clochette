from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, relationship

from app.db.base_class import Base, build_fk_annotation

if TYPE_CHECKING:  # pragma: no cover
    from .non_inventoried_item import NonInventoriedItem
    from .transaction import Transaction

non_inventoried_item_fk = build_fk_annotation("noninventorieditem")
transaction_fk = build_fk_annotation("transaction")


class NonInventoried(Base):
    """
    Represents an out of stock item in the database.

    Attributes:
        - `buy_price` is the price of buy of the item.
            - If this item is meant to be sold, the price will be None,
                and the `sell_price` of the item will be a float.
            - If this item is meant to be bought, the price will be a float,
                and the `sell_price` of the item will be None.
        - `sell_price` is the price of sell of the item (frozen at the time of the transaction).
        - `item_id` is the id of the item.
    """

    buy_price: Mapped[float | None]
    sell_price: Mapped[float | None]

    non_inventoried_item_id: Mapped[non_inventoried_item_fk]
    non_inventoried_item: Mapped["NonInventoriedItem"] = relationship(
        back_populates="non_inventorieds",
        lazy="selectin",
    )

    transaction_id: Mapped[transaction_fk]
    transaction: Mapped["Transaction"] = relationship(
        back_populates="non_inventorieds",
        lazy="selectin",
    )
