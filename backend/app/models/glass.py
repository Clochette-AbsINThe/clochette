from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Glass(Base):
    id = Column(Integer, primary_key=True, nullable=False)
    barrel_id = Column(Integer, ForeignKey("barrel.id"))
    price = Column(Float, nullable=False)

    transaction_id = Column(Integer, ForeignKey("transaction.id"))
    transaction = relationship("Transaction", back_populates="glasses")
