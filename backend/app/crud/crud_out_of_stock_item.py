from app.crud.base import CRUDBase
from app.models.out_of_stock_item import OutOfStockItem
from app.schemas.out_of_stock_item import OutOfStockItemCreate, OutOfStockItemUpdate


class CRUDOutOfStockItem(
    CRUDBase[OutOfStockItem, OutOfStockItemCreate, OutOfStockItemUpdate],
): ...


out_of_stock_item = CRUDOutOfStockItem(OutOfStockItem)
