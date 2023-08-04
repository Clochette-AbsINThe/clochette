from sqlalchemy import Column, Float, ForeignKey, Integer
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class OutOfStock(Base):
    """
    Represents an out of stock item in the database.

    `unit_price` is the price of buy of the item.
        - If this item is meant to be sold, the price will be None, and the `sell_price` of the item will be a float.
        - If this item is meant to be bought, the price will be a float, and the `sell_price` of the item will be None.
    """

    id = Column(Integer, primary_key=True, nullable=False)
    unit_price = Column(Float, nullable=True)

    item_id = Column(Integer, ForeignKey("outofstockitem.id"))
    item = relationship("OutOfStockItem", back_populates="outofstocks", lazy="selectin")

    transaction_id = Column(Integer, ForeignKey("transaction.id"))
    transaction = relationship(
        "Transaction", back_populates="out_of_stocks", lazy="selectin"
    )
