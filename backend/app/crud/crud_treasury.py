from app.crud.base import CRUDBase
from app.models.treasury import Treasury
from app.schemas.treasury import TreasuryCreate, TreasuryUpdate


class CRUDTreasury(CRUDBase[Treasury, TreasuryCreate, TreasuryUpdate]):
    ...


treasury = CRUDTreasury(Treasury)
