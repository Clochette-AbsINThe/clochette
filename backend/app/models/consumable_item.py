import enum

from sqlalchemy import Column, Enum, Integer, String
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class IconName(str, enum.Enum):
    glass = 'Glass'
    beer = 'Beer'
    food = 'Food'
    soft = 'Soft'
    barrel = 'Barrel'
    misc = 'Misc'


class ConsumableItem(Base):
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, nullable=False)
    icon = Column(Enum(IconName), nullable=False)

    consumables = relationship("Consumable", back_populates="consumable_item")
