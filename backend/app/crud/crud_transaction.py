import importlib

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionFrontCreate, TransactionUpdate


class CRUDTransaction(CRUDBase[Transaction, TransactionCreate, TransactionUpdate]):
    def create(self, db: Session, *, obj_in: TransactionFrontCreate) -> Transaction:
        try:
            # Create transaction
            transaction = super().create(db, obj_in=TransactionCreate(**obj_in.dict()))
            # Get items
            items = obj_in.items
            for i in range(len(items)):
                crud_table = getattr(importlib.import_module(f'app.crud.crud_{items[i].table}'), items[i].table)
                for _ in range(items[i].quantity):
                    obj_in = items[i].item
                    crud_table.create(db, obj_in=items[i].item)
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=400, detail=f'Data relationship integrity error')
        return transaction


transaction = CRUDTransaction(Transaction)
