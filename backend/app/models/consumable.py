from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, relationship, validates

from app.db.base_class import Base, build_fk_annotation

if TYPE_CHECKING:  # pragma: no cover
    from .consumable_item import ConsumableItem

consumableitem_fk = build_fk_annotation("consumableitem")
transaction_fk = build_fk_annotation("transaction")
transaction_v1_fk = build_fk_annotation("transactionv1")


class Consumable(Base):
    """This model represents a consumable in the database.

    Attributes:
        - `sell_price`: The price of sell of the consumable.
        - `buy_price`: The price of purchase of the consumable.
        - `solded`: Whether the consumable is solded or not.
        - `consumable_item_id`: The id of the consumable item of the consumable.
    """

    sell_price: Mapped[float]
    buy_price: Mapped[float]
    solded: Mapped[bool]

    consumable_item_id: Mapped[consumableitem_fk]
    consumable_item: Mapped["ConsumableItem"] = relationship(
        back_populates="consumables", lazy="selectin"
    )

    transaction_id_purchase: Mapped[transaction_fk | None]
    transaction_id_sale: Mapped[transaction_fk | None]

    transaction_v1_id_purchase: Mapped[transaction_v1_fk | None]
    transaction_v1_id_sale: Mapped[transaction_v1_fk | None]

    @validates("transaction_id_sale")
    def validate_transaction_id_sale(self, _key, transaction_id_sale):
        if transaction_id_sale is None:
            self.solded = False

        return transaction_id_sale
