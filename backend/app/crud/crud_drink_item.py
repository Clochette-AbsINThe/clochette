from app.crud.base import CRUDBase
from app.models.drink_item import DrinkItem
from app.schemas.drink_item import DrinkItemCreate, DrinkItemUpdate


class CRUDDrinkItem(CRUDBase[DrinkItem, DrinkItemCreate, DrinkItemUpdate]): ...


drink_item = CRUDDrinkItem(DrinkItem)
