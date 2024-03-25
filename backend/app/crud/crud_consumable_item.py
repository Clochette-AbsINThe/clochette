from app.crud.base import CRUDBase
from app.models.consumable_item import ConsumableItem
from app.schemas.consumable_item import ConsumableItemCreate, ConsumableItemUpdate


class CRUDConsumableItem(
    CRUDBase[ConsumableItem, ConsumableItemCreate, ConsumableItemUpdate],
): ...


consumable_item = CRUDConsumableItem(ConsumableItem)
