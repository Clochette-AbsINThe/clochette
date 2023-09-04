from typing import TYPE_CHECKING, List

from sqlalchemy.orm import Mapped, relationship, validates

from app.db.base_class import Base, build_fk_annotation

if TYPE_CHECKING:  # pragma: no cover
    from .drink_item import DrinkItem
    from .glass import Glass
    from .transaction_v1 import TransactionV1

drink_item_fk = build_fk_annotation("drinkitem")
transaction_fk = build_fk_annotation("transaction")
transaction_v1_fk = build_fk_annotation("transactionv1")


class Barrel(Base):
    """This model represents a barrel in the database.

    Attributes:
        - `buy_price`: The price of purchase of the barrel.
        - `sell_price`: The price of sell of a glass of the barrel.
        - `barrel_sell_price`: The price of sell of the barrel, if it is solded separately.
        - `is_mounted`: Whether the barrel is mounted or not.
        - `empty_or_solded`: Whether the barrel is empty or solded. (Meaning that it is not in the bar anymore)
        - `drink_item_id`: The id of the drink item of the barrel.
    """

    buy_price: Mapped[float]
    sell_price: Mapped[float]
    barrel_sell_price: Mapped[float | None]
    is_mounted: Mapped[bool]
    empty_or_solded: Mapped[bool]

    drink_item_id: Mapped[drink_item_fk]
    drink_item: Mapped["DrinkItem"] = relationship(
        back_populates="barrels", lazy="selectin"
    )

    transaction_v1_id: Mapped[transaction_v1_fk | None]
    transaction_v1: Mapped["TransactionV1"] = relationship(
        back_populates="barrels", lazy="selectin"
    )

    transaction_id_purchase: Mapped[transaction_fk | None]
    transaction_id_sale: Mapped[transaction_fk | None]

    glasses: Mapped[List["Glass"]] = relationship(
        back_populates="barrel", lazy="selectin"
    )

    @validates("transaction_id_sale")
    def validate_transaction_id_sale(self, _key, transaction_id_sale):
        if transaction_id_sale is None:
            self.empty_or_solded = False

        return transaction_id_sale
