from sqlalchemy import Boolean, Column, Enum, Float, Integer, String
from sqlalchemy.orm import relationship

from app.core.types import IconName
from app.db.base_class import Base


class OutOfStockItem(Base):
    id = Column(Integer, primary_key=True, nullable=False)
    # True means buy, False means sell
    buy_or_sell = Column(Boolean, nullable=False)
    name = Column(String, nullable=False)
    icon = Column(Enum(IconName), nullable=False)
    sell_price = Column(Float, nullable=True)

    outofstocks = relationship("OutOfStock", back_populates="item", lazy="selectin")
