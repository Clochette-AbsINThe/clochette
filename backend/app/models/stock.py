from sqlalchemy import Column, Integer
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Stock(Base):
    id = Column(Integer, primary_key=True, nullable=False)

    barrels = relationship("Barrel", back_populates="stock")
    consumables = relationship("Consumable", back_populates="stock")
