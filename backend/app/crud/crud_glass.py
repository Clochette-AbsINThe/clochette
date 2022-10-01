from app.crud.base import CRUDBase
from app.models.glass import Glass
from app.schemas.glass import GlassCreate, GlassUpdate


class CRUDGlass(CRUDBase[Glass, GlassCreate, GlassUpdate]):
    ...


glass = CRUDGlass(Glass)
