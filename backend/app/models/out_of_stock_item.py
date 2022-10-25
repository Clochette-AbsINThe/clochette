from sqlalchemy import Boolean, Column, Enum, Integer, String
from sqlalchemy.orm import relationship

from app.core.types import IconName
from app.db.base_class import Base


class OutOfStockItem(Base):
    id = Column(Integer, primary_key=True, nullable=False)
    buy_or_sell = Column(Boolean, nullable=False) # True means buy, False means sell
    name = Column(String, nullable=False)
    icon = Column(Enum(IconName), nullable=False)
    sell_price = Column(Integer, nullable=True)

    outofstocks = relationship("OutOfStock", back_populates="item")
