from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, relationship

from app.db.base_class import Base, build_fk_annotation

if TYPE_CHECKING:  # pragma: no cover
    from .out_of_stock_item import OutOfStockItem
    from .transaction_v1 import TransactionV1

outofstockitem_fk = build_fk_annotation("outofstockitem")
transaction_v1_fk = build_fk_annotation("transactionv1")


class OutOfStock(Base):
    """
    Represents an out of stock item in the database.

    `unit_price` is the price of buy of the item.
        - If this item is meant to be sold, the price will be None, and the `sell_price` of the item will be a float.
        - If this item is meant to be bought, the price will be a float, and the `sell_price` of the item will be None.
    """

    unit_price: Mapped[float | None]

    item_id: Mapped[outofstockitem_fk]
    item: Mapped["OutOfStockItem"] = relationship(
        back_populates="outofstocks", lazy="selectin"
    )

    transaction_v1_id: Mapped[transaction_v1_fk]
    transaction_v1: Mapped["TransactionV1"] = relationship(
        back_populates="out_of_stocks", lazy="selectin"
    )
