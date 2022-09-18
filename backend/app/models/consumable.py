from ast import For
from sqlalchemy import Column, Integer, Float, ForeignKey

from app.db.base_class import Base


class Consumable(Base):
    id = Column(Integer, primary_key=True, nullable=False)
    transaction_id_purchase = Column(Integer, ForeignKey("transaction.id"))
    transaction_id_sale = Column(Integer, ForeignKey("transaction.id"))
    consumable_item_id = Column(Integer, ForeignKey("consumableitem.id"))
    stock_id = Column(Integer, ForeignKey("stock.id"))
    selling_price = Column(Float, nullable=False)
    buying_price = Column(Float, nullable=False)
