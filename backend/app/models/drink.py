from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Drink(Base):
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(256), nullable=False)

    barrels = relationship("Barrel", back_populates="drink")
