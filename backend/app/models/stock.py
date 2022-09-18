from sqlalchemy import Column, Integer

from app.db.base_class import Base


class Stock(Base):
    id = Column(Integer, primary_key=True, nullable=False)
