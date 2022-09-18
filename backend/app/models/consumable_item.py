from sqlalchemy import Column, Integer, String

from app.db.base_class import Base


class ConsumableItem(Base):
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, nullable=False)
