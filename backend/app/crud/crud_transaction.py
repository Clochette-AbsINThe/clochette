import importlib

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.decorator import handle_exceptions
from app.crud.base import CRUDBase
from app.crud.crud_treasury import treasury as treasuries
from app.models.transaction import Transaction
from app.schemas.consumable import ConsumableUpdate
from app.schemas.transaction import TransactionCreate, TransactionFrontCreate, TransactionUpdate


class CRUDTransaction(CRUDBase[Transaction, TransactionCreate, TransactionUpdate]):
    @handle_exceptions('Data relationship integrity error', IntegrityError)
    def create(self, db: Session, *, obj_in: TransactionFrontCreate) -> Transaction:
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
                else:
                    crud_table.create(db, obj_in=obj_in)
        
        return transaction


transaction = CRUDTransaction(Transaction)
