from sqlalchemy import Boolean, Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Barrel(Base):
    id = Column(Integer, primary_key=True, nullable=False)
    price = Column(Float, nullable=False)
    is_mounted = Column(Boolean, nullable=False)
    empty = Column(Boolean, nullable=False)

    drink_id = Column(Integer, ForeignKey("drink.id"))
    drink = relationship("Drink", back_populates="barrels")

    stock_id = Column(Integer, ForeignKey("stock.id"))
    stock = relationship("Stock", back_populates="barrels")

    transaction_id = Column(Integer, ForeignKey("transaction.id"))
    transaction = relationship("Transaction", back_populates="barrels")

    glasses = relationship("Glass", back_populates="barrel")
