from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, relationship

from app.db.base_class import Base, build_fk_annotation

if TYPE_CHECKING:  # pragma: no cover
    from .barrel import Barrel
    from .transaction import Transaction

barrel_fk = build_fk_annotation("barrel")
transaction_fk = build_fk_annotation("transaction")


class Glass(Base):
    barrel_id: Mapped[barrel_fk]
    barrel: Mapped["Barrel"] = relationship(back_populates="glasses", lazy="selectin")

    transaction_id: Mapped[transaction_fk]
    transaction: Mapped["Transaction"] = relationship(
        back_populates="glasses", lazy="selectin"
    )
