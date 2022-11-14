import importlib

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.crud.crud_treasury import treasury as treasuries
from app.models.transaction import Transaction
from app.schemas.consumable import ConsumableUpdate
from app.schemas.transaction import TransactionCreate, TransactionFrontCreate, TransactionUpdate


class CRUDTransaction(CRUDBase[Transaction, TransactionCreate, TransactionUpdate]):
    def create(self, db: Session, *, obj_in: TransactionFrontCreate) -> Transaction:
        try:
            transaction_create = TransactionCreate(**obj_in.dict())
            # Update treasury
            treasuries.add_transaction(db, obj_in=transaction_create)
            # Store transaction
            transaction = super().create(db, obj_in=transaction_create)
            # Get items
            items = obj_in.items
            for i in range(len(items)):
                crud_table = getattr(importlib.import_module(f'app.crud.crud_{items[i].table}'), items[i].table)
                for _ in range(items[i].quantity):
                    obj_in = items[i].item
                    if transaction.sale is True and items[i].table == 'consumable':
                        crud_table.update(db, db_obj=crud_table.get(db, id=items[i].id), obj_in=ConsumableUpdate(**obj_in.dict()))
                    crud_table.create(db, obj_in=obj_in)
        except IntegrityError as e:
            db.rollback()
            print(e) # TODO: Remove when email alert middleware is implemented #24
            raise HTTPException(status_code=400, detail=f'Data relationship integrity error')
        
        return transaction


transaction = CRUDTransaction(Transaction)
