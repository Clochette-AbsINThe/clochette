from app.crud.base import CRUDBase
from app.models.drink import Drink
from app.schemas.drink import DrinkCreate, DrinkUpdate


class CRUDDrink(CRUDBase[Drink, DrinkCreate, DrinkUpdate]):
    ...


drink = CRUDDrink(Drink)
