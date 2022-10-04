import enum

from sqlalchemy import Boolean, Column, DateTime, Enum, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class PaymentMethod(str, enum.Enum):
    LYDIA = "Lydia"
    PUMPKIN = "Pumpkin"
    SEPA = "Virement SEPA"
    CASH = "Espèces"
    TPE = "Carte bancaire"


class Transaction(Base):
    id = Column(Integer, primary_key=True, index=True)
    treasury_id = Column(Integer, ForeignKey("treasury.id"))
    datetime = Column(DateTime, nullable=False)
    payment_method = Column(Enum(PaymentMethod), nullable=False)
    amount = Column(Float, nullable=False)
    sale = Column(Boolean, nullable=False) # True means selling, False means buying

    barrels = relationship("Barrel", back_populates="transaction")
    glasses = relationship("Glass", back_populates="transaction")
