from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Consumable(Base):
    id = Column(Integer, primary_key=True, nullable=False)
    selling_price = Column(Float, nullable=False)
    buying_price = Column(Float, nullable=False)

    consumable_item_id = Column(Integer, ForeignKey("consumableitem.id"))
    consumable_item = relationship("ConsumableItem", back_populates="consumables")

    stock_id = Column(Integer, ForeignKey("stock.id"))
    stock = relationship("Stock", back_populates="consumables")

    transaction_id_purchase = Column(Integer, ForeignKey("transaction.id"))
    #transaction_purchase = relationship("Transaction", back_populates="consumables_purchase")

    transaction_id_sale = Column(Integer, ForeignKey("transaction.id"))
    #transaction_sale = relationship("Transaction", back_populates="consumables_sale")
