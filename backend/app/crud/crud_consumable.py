from app.crud.base import CRUDBase
from app.models.consumable import Consumable
from app.schemas.consumable import ConsumableCreate, ConsumableUpdate


class CRUDConsumable(CRUDBase[Consumable, ConsumableCreate, ConsumableUpdate]):
    ...


consumable = CRUDConsumable(Consumable)
