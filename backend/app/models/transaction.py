from sqlalchemy import Boolean, Column, DateTime, Enum, Integer, Float, ForeignKey, UnicodeText
from sqlalchemy.orm import relationship

from app.core.types import PaymentMethod, TransactionType
from app.db.base_class import Base


class Transaction(Base):
    id = Column(Integer, primary_key=True, index=True)
    datetime = Column(DateTime(timezone=True), nullable=False)
    payment_method = Column(Enum(PaymentMethod), nullable=False)
    amount = Column(Float, nullable=False)
    sale = Column(Boolean, nullable=False) # True means selling, False means buying
    type = Column(Enum(TransactionType), nullable=False)
    description = Column(UnicodeText, nullable=True)

    treasury_id = Column(Integer, ForeignKey("treasury.id"))

    barrels = relationship("Barrel", back_populates="transaction", cascade="all, delete-orphan", lazy="selectin")
    consumables_purchase = relationship("Consumable", foreign_keys="Consumable.transaction_id_purchase", cascade="all, delete-orphan", lazy="selectin")
    consumables_sale = relationship("Consumable", foreign_keys="Consumable.transaction_id_sale", cascade="all, delete-orphan", lazy="selectin")
    glasses = relationship("Glass", back_populates="transaction", cascade="all, delete-orphan", lazy="selectin")
    out_of_stocks = relationship("OutOfStock", back_populates="transaction", cascade="all, delete-orphan", lazy="selectin")
