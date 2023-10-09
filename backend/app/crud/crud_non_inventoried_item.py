from app.crud.base import CRUDBase
from app.models.non_inventoried_item import NonInventoriedItem
from app.schemas.v2.non_inventoried_item import (
    NonInventoriedItemCreate,
    NonInventoriedItemUpdate,
)


class CRUDNonInventoriedItem(
    CRUDBase[NonInventoriedItem, NonInventoriedItemCreate, NonInventoriedItemUpdate]
):
    ...


non_inventoried_item = CRUDNonInventoriedItem(NonInventoriedItem)
