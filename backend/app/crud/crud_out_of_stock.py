from app.crud.base import CRUDBase
from app.models.out_of_stock import OutOfStock
from app.schemas.out_of_stock import OutOfStockCreate, OutOfStockUpdate


class CRUDOutOfStock(CRUDBase[OutOfStock, OutOfStockCreate, OutOfStockUpdate]): ...


out_of_stock = CRUDOutOfStock(OutOfStock)
