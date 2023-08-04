from sqlalchemy import Boolean, Column, Float, Integer, String
from sqlalchemy.orm import relationship

from app.core.types import IconName
from app.db.base_class import Base, Enum


class OutOfStockItem(Base):
    """
    Represents an item which will not appears in the stock.
    (e.g. product not to sold, or to sold separately)

    `buy_or_sell` is a boolean which indicates if the item is meant to be bought or sold.
        - True means buy (The `sell_price` will be None)
        - False means sell (The `sell_price` will be a float)
    """

    id = Column(Integer, primary_key=True, nullable=False)
    buy_or_sell = Column(Boolean, nullable=False)
    name = Column(String, nullable=False)
    icon = Column(Enum(IconName), nullable=False)
    sell_price = Column(Float, nullable=True)

    outofstocks = relationship("OutOfStock", back_populates="item", lazy="selectin")
