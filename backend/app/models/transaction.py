from typing import TYPE_CHECKING, List

from sqlalchemy.orm import Mapped, relationship

from app.core.types import PaymentMethod, Status, TradeType, TransactionType
from app.db.base_class import Base, Datetime, Text, build_fk_annotation

if TYPE_CHECKING:  # pragma: no cover
    from .barrel import Barrel
    from .consumable import Consumable
    from .glass import Glass
    from .non_inventoried import NonInventoried


treasury_fk: type[int] = build_fk_annotation("treasury")


class Transaction(Base):
    """
    Represents a transaction in the database.

    Attributes:
        - `datetime` is the datetime of the transaction.
        - `payment_method` is the payment method of the transaction.
        - `trade` is the trade type of the transaction.
        - `type` is the type of the transaction.
        - `status` is the status of the transaction.
        - `amount` is the real amount of the transaction,
            could be negative and with lydia fees.
        - `description` is the description of the transaction.
        - `treasury_id` is the id of the treasury.

    Relationships:
        - `barrels_purchase` is the list of barrels bought in the transaction.
        - `barrels_sale` is the list of barrels sold in the transaction.
        - `consumables_purchase` is the list of consumables bought in the transaction.
        - `consumables_sale` is the list of consumables sold in the transaction.
        - `glasses` is the list of glasses sold in the transaction.
        - `non_inventorieds` is the list of non-inventoried items sold in the transaction.

    Calculated attributes:
        - `price_sum` is the sum of the price of all the items in the transaction.
    """

    datetime: Mapped[Datetime]
    payment_method: Mapped[PaymentMethod]
    trade: Mapped[TradeType]
    type: Mapped[TransactionType]
    status: Mapped[Status]
    amount: Mapped[float]
    description: Mapped[Text]

    treasury_id: Mapped[treasury_fk]

    barrels_purchase: Mapped[List["Barrel"]] = relationship(
        foreign_keys="Barrel.transaction_id_purchase",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    barrels_sale: Mapped[List["Barrel"]] = relationship(
        foreign_keys="Barrel.transaction_id_sale",
        cascade="save-update",
        lazy="selectin",
    )
    consumables_purchase: Mapped[List["Consumable"]] = relationship(
        foreign_keys="Consumable.transaction_id_purchase",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    consumables_sale: Mapped[List["Consumable"]] = relationship(
        foreign_keys="Consumable.transaction_id_sale",
        cascade="save-update",
        lazy="selectin",
    )
    glasses: Mapped[List["Glass"]] = relationship(
        back_populates="transaction",
        lazy="selectin",
        cascade="all, delete-orphan",
    )
    non_inventorieds: Mapped[List["NonInventoried"]] = relationship(
        back_populates="transaction",
        lazy="selectin",
        cascade="all, delete-orphan",
    )

    @property
    def price_sum(self) -> float:
        if self.trade == TradeType.PURCHASE:
            return (
                sum(barrel.buy_price for barrel in self.barrels_purchase)
                + sum(consumable.buy_price for consumable in self.consumables_purchase)
                + sum(
                    non_inventoried.buy_price
                    for non_inventoried in self.non_inventorieds
                    if non_inventoried.buy_price is not None
                )
            )

        return (
            sum(glass.transaction_sell_price for glass in self.glasses if glass.transaction_sell_price is not None)
            + sum(barrel.barrel_sell_price for barrel in self.barrels_sale if barrel.barrel_sell_price is not None)
            + sum(consumable.sell_price for consumable in self.consumables_sale)
            + sum(
                non_inventoried.sell_price
                for non_inventoried in self.non_inventorieds
                if non_inventoried.sell_price is not None
            )
        )
