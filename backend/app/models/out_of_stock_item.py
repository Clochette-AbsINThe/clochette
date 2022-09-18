from sqlalchemy import Boolean, Column, Integer, String

from app.db.base_class import Base


class OutOfStockItem(Base):
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, nullable=False)
    sale = Column(Boolean, nullable=False)  # True is selling, False is buying
