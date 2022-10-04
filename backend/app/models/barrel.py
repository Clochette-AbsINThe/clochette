from sqlalchemy import Boolean, Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Barrel(Base):
    id = Column(Integer, primary_key=True, nullable=False)
    transaction_id = Column(Integer, ForeignKey("transaction.id"))
    drink_id = Column(Integer, ForeignKey("drink.id"))
    stock_id = Column(Integer, ForeignKey("stock.id"))
    price = Column(Float, nullable=False)
    is_mounted = Column(Boolean, nullable=False)
    empty = Column(Boolean, nullable=False)

    drink = relationship("Drink", back_populates="barrels")
    stock = relationship("Stock", back_populates="barrels")
    transaction = relationship("Transaction", back_populates="barrels")
