from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class ConsumableItem(Base):
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, nullable=False)

    consumables = relationship("Consumable", back_populates="consumable_item")
