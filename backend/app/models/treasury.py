from sqlalchemy import Column, Integer, Float

from app.db.base_class import Base


class Treasury(Base):
    id = Column(Integer, primary_key=True, nullable=False)
    total_amount = Column(Float, nullable=False)
    cash_amount = Column(Float, nullable=False)
