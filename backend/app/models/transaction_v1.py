from typing import TYPE_CHECKING, List

from sqlalchemy.orm import Mapped, relationship

from app.core.types import PaymentMethod, TransactionTypeV1
from app.db.base_class import Base, Datetime, Text, build_fk_annotation

if TYPE_CHECKING:  # pragma: no cover
    from .barrel import Barrel
    from .consumable import Consumable
    from .glass import Glass
    from .out_of_stock import OutOfStock


treasury_fk = build_fk_annotation("treasury")


class TransactionV1(Base):
    datetime: Mapped[Datetime]
    payment_method: Mapped[PaymentMethod]
    amount: Mapped[float]
    sale: Mapped[bool]  # ! True means selling, False means buying
    type: Mapped[TransactionTypeV1]
    description: Mapped[Text]

    treasury_id: Mapped[treasury_fk]

    barrels: Mapped[List["Barrel"]] = relationship(
        back_populates="transaction_v1",
        lazy="selectin",
        cascade="all, delete-orphan",
    )
    consumables_purchase: Mapped[List["Consumable"]] = relationship(
        foreign_keys="Consumable.transaction_v1_id_purchase",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    consumables_sale: Mapped[List["Consumable"]] = relationship(
        foreign_keys="Consumable.transaction_v1_id_sale",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    glasses: Mapped[List["Glass"]] = relationship(
        back_populates="transaction_v1",
        lazy="selectin",
        cascade="all, delete-orphan",
    )
    out_of_stocks: Mapped[List["OutOfStock"]] = relationship(
        back_populates="transaction_v1",
        lazy="selectin",
        cascade="all, delete-orphan",
    )
