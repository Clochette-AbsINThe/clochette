from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.core.types import IconName
from app.db.base_class import Base, Enum


class ConsumableItem(Base):
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, nullable=False)
    icon = Column(Enum(IconName), nullable=False)

    consumables = relationship(
        "Consumable", back_populates="consumable_item", lazy="selectin"
    )
