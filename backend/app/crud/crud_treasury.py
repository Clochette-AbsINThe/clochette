from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.types import PaymentMethod
from app.crud.base import CRUDBase
from app.models.treasury import Treasury
from app.schemas.transaction import TransactionCreate
from app.schemas.treasury import TreasuryCreate, TreasuryUpdate


class CRUDTreasury(CRUDBase[Treasury, TreasuryCreate, TreasuryUpdate]):
    def add_transaction(self, db: Session, *, obj_in: TransactionCreate) -> Treasury:
        treasury: Treasury = self.read(db, obj_in.treasury_id)
        if treasury is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='Treasury not found'
            )
        treasury.total_amount += obj_in.amount if obj_in.sale else -obj_in.amount
        if obj_in.payment_method == PaymentMethod.cash:
            treasury.cash_amount += obj_in.amount if obj_in.sale else -obj_in.amount
            if treasury.cash_amount < 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail='Treasury cash amount cannot be negative'
                )
        return self.update(db, db_obj=treasury, obj_in=TreasuryUpdate.from_orm(treasury))


treasury = CRUDTreasury(Treasury)
