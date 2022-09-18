from sqlalchemy import Column, Integer, Float, ForeignKey

from app.db.base_class import Base


class OutOfStock(Base):
    id = Column(Integer, primary_key=True, nullable=False)
    transaction_id = Column(Integer, ForeignKey("transaction.id"))
    item_id = Column(Integer, ForeignKey("outofstockitem.id"))
    price = Column(Float, nullable=False)
