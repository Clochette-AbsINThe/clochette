import enum

from sqlalchemy import Boolean, Column, DateTime, Enum, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.core.types import PaymentMethod
from app.db.base_class import Base


class Transaction(Base):
    id = Column(Integer, primary_key=True, index=True)
    datetime = Column(DateTime, nullable=False)
    payment_method = Column(Enum(PaymentMethod), nullable=False)
    amount = Column(Float, nullable=False)
    sale = Column(Boolean, nullable=False) # True means selling, False means buying

    treasury_id = Column(Integer, ForeignKey("treasury.id"))
    treasury = relationship("Treasury", back_populates="transactions")

    barrels = relationship("Barrel", back_populates="transaction", cascade="all, delete-orphan")
    consumables_purchase = relationship("Consumable", foreign_keys="Consumable.transaction_id_purchase", cascade="all, delete-orphan")
    consumables_sale = relationship("Consumable", foreign_keys="Consumable.transaction_id_sale", cascade="all, delete-orphan")
    glasses = relationship("Glass", back_populates="transaction", cascade="all, delete-orphan")
    out_of_stocks = relationship("OutOfStock", back_populates="transaction", cascade="all, delete-orphan")
