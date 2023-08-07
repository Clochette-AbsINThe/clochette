from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, relationship

from app.db.base_class import Base, build_fk_annotation

if TYPE_CHECKING:  # pragma: no cover
    from .consumable_item import ConsumableItem

consumableitem_fk = build_fk_annotation("consumableitem")
transaction_fk = build_fk_annotation("transaction")


class Consumable(Base):
    sell_price: Mapped[float]
    unit_price: Mapped[float]
    empty: Mapped[bool]

    consumable_item_id: Mapped[consumableitem_fk]
    consumable_item: Mapped["ConsumableItem"] = relationship(
        back_populates="consumables", lazy="selectin"
    )

    transaction_id_purchase: Mapped[transaction_fk | None]
    transaction_id_sale: Mapped[transaction_fk | None]
