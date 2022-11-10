from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class OutOfStock(Base):
    id = Column(Integer, primary_key=True, nullable=False)
    unit_price = Column(Float, nullable=True)

    item_id = Column(Integer, ForeignKey("outofstockitem.id"))
    item = relationship("OutOfStockItem", back_populates="outofstocks")

    transaction_id = Column(Integer, ForeignKey("transaction.id"))
    transaction = relationship("Transaction", back_populates="outofstocks")
