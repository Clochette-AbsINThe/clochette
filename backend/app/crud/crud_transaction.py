import importlib

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.decorator import handle_exceptions
from app.core.translation import Translator
from app.crud.base import CRUDBase
from app.crud.crud_treasury import treasury as treasuries
from app.models.transaction import Transaction
from app.schemas.consumable import ConsumableCreatePurchase, ConsumableCreateSale, ConsumableUpdate
from app.schemas.transaction import TransactionCreate, TransactionFrontCreate, TransactionUpdate


translator = Translator()


class CRUDTransaction(CRUDBase[Transaction, TransactionCreate, TransactionUpdate]):
    @handle_exceptions(translator.INTEGRITY_ERROR, IntegrityError)
    def create(self, db: Session, *, obj_in: TransactionFrontCreate) -> Transaction:
        """
        Create a new transaction in the database.

        :param db: The database session
        :param obj_in: The data for the transaction to be created.

        :return: The created transaction.
        """
        # Create a `TransactionCreate` object from the input data
        transaction_create = TransactionCreate(**obj_in.dict())
        # Update treasury
        treasuries.add_transaction(db, obj_in=transaction_create)
        # Store transaction using the super method
        transaction = super().create(db, obj_in=transaction_create)
        # Get the items from the input data
        items = obj_in.items
        # Iterate over the items
        for i in range(len(items)):
            # Get the CRUD utility corresponding to the item's table
            crud_table = getattr(importlib.import_module(f'app.crud.crud_{items[i].table}'), items[i].table)
            # Iterate over the number of items
            for _ in range(items[i].quantity):
                # Get the item's data
                obj_in = items[i].item
                # If the item is a consumable item, create a `ConsumableCreatePurchase` or `ConsumableCreateSale` object
                # from the item data depending on wheher the transaction is a sale or a purchase
                if items[i].table == 'consumable':
                    obj_in = ConsumableCreateSale(**obj_in.dict(), transaction_id=transaction.id) if transaction.sale else ConsumableCreatePurchase(**obj_in.dict(), transaction_id=transaction.id)
                    # If the transaction is a sale, update the consumable item using the update method of the CRUD
                    # utility, otherwise create a new consumable item using the create method of the CRUD utility
                    if transaction.sale:
                        crud_table.update(db, db_obj=crud_table.read(db, id=obj_in.id), obj_in=ConsumableUpdate(**obj_in.dict()))
                    else:
                        crud_table.create(db, obj_in=obj_in)
                else:
                    # Set the transaction id of the item data to the transaction's id
                    obj_in.transaction_id = transaction.id
                    # Create a new item using the create method of the CRUD utility
                    crud_table.create(db, obj_in=obj_in)
        
        # Return the created transaction
        return transaction


transaction = CRUDTransaction(Transaction)
