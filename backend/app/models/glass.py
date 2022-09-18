from sqlalchemy import Column, Integer, Float, ForeignKey

from app.db.base_class import Base


class Glass(Base):
    id = Column(Integer, primary_key=True, nullable=False)
    transaction_id = Column(Integer, ForeignKey("transaction.id"))
    barrel_id = Column(Integer, ForeignKey("barrel.id"))
    price = Column(Float, nullable=False)
