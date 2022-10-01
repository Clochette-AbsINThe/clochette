from app.crud.base import CRUDBase
from app.models.stock import Stock
from app.schemas.stock import StockCreate, StockUpdate


class CRUDStock(CRUDBase[Stock, StockCreate, StockUpdate]):
    ...


stock = CRUDStock(Stock)
