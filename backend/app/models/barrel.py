from sqlalchemy import Boolean, Column, Float, ForeignKey, Integer
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Barrel(Base):
    id = Column(Integer, primary_key=True, nullable=False)
    unit_price = Column(Float, nullable=False)
    sell_price = Column(Float, nullable=False)
    is_mounted = Column(Boolean, nullable=False)
    empty = Column(Boolean, nullable=False)

    drink_id = Column(Integer, ForeignKey("drink.id"))
    drink = relationship("Drink", back_populates="barrels", lazy="selectin")

    transaction_id = Column(Integer, ForeignKey("transaction.id"))
    transaction = relationship("Transaction", back_populates="barrels", lazy="selectin")

    glasses = relationship("Glass", back_populates="barrel", lazy="selectin")
