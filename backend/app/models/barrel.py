from typing import TYPE_CHECKING, List

from sqlalchemy.orm import Mapped, relationship

from app.db.base_class import Base, build_fk_annotation

if TYPE_CHECKING:  # pragma: no cover
    from .drink import Drink
    from .glass import Glass
    from .transaction import Transaction

drink_fk = build_fk_annotation("drink")
transaction_fk = build_fk_annotation("transaction")


class Barrel(Base):
    unit_price: Mapped[float]
    sell_price: Mapped[float]
    is_mounted: Mapped[bool]
    empty: Mapped[bool]

    drink_id: Mapped[drink_fk]
    drink: Mapped["Drink"] = relationship(back_populates="barrels", lazy="selectin")

    transaction_id: Mapped[transaction_fk]
    transaction: Mapped["Transaction"] = relationship(
        back_populates="barrels", lazy="selectin"
    )

    glasses: Mapped[List["Glass"]] = relationship(
        back_populates="barrel", lazy="selectin"
    )
