from app.crud.base import CRUDBase
from app.models.barrel import Barrel
from app.schemas.barrel import BarrelCreate, BarrelUpdate


class CRUDBarrel(CRUDBase[Barrel, BarrelCreate, BarrelUpdate]):
    ...


barrel = CRUDBarrel(Barrel)