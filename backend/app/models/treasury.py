from sqlalchemy import Column, Integer, Float
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Treasury(Base):
    id = Column(Integer, primary_key=True, nullable=False)
    total_amount = Column(Float, nullable=False)
    cash_amount = Column(Float, nullable=False)

    transactions = relationship("Transaction", back_populates="treasury", lazy="selectin")
