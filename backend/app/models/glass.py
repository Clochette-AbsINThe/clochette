from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, relationship

from app.db.base_class import Base, build_fk_annotation

if TYPE_CHECKING:  # pragma: no cover
    from .barrel import Barrel
    from .transaction import Transaction
    from .transaction_v1 import TransactionV1

barrel_fk = build_fk_annotation("barrel")
transaction_fk = build_fk_annotation("transaction")
transaction_v1_fk = build_fk_annotation("transactionv1")


class Glass(Base):
    """This model represents a glass in the database.

    Attributes:
        - `transaction_sell_price`: The price of sell of the glass (frozen at the time of the transaction).
        - `barrel_id`: The id of the barrel which the glass is from.
        - `transaction_id`: The id of the transaction which the glass is from.
    """

    transaction_sell_price: Mapped[float | None]

    barrel_id: Mapped[barrel_fk]
    barrel: Mapped["Barrel"] = relationship(back_populates="glasses", lazy="selectin")

    transaction_id: Mapped[transaction_fk | None]
    transaction: Mapped["Transaction"] = relationship(
        back_populates="glasses", lazy="selectin"
    )

    transaction_v1_id: Mapped[transaction_v1_fk | None]
    transaction_v1: Mapped["TransactionV1"] = relationship(
        back_populates="glasses", lazy="selectin"
    )
