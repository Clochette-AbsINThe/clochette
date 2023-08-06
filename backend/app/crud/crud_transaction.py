import importlib

from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.decorator import handle_exceptions
from app.core.translation import Translator
from app.crud.base import CRUDBase
from app.crud.crud_treasury import treasury as treasuries
from app.models.transaction import Transaction
from app.schemas.consumable import ConsumableCreatePurchase, ConsumableCreateSale
from app.schemas.item import Item
from app.schemas.transaction import (
    TransactionCreate,
    TransactionFrontCreate,
    TransactionUpdate,
)

translator = Translator()


class CRUDTransaction(CRUDBase[Transaction, TransactionCreate, TransactionUpdate]):
    @handle_exceptions(translator.INTEGRITY_ERROR, IntegrityError)
    async def create(
        self, db: AsyncSession, *, obj_in: TransactionFrontCreate
    ) -> Transaction:
        """
        Create a new transaction in the database.

        :param db: The database session
        :param obj_in: The data for the transaction to be created.

        :return: The created transaction.
        """
        # Create a `TransactionCreate` object from the input data
        transaction_create = TransactionCreate(**obj_in.model_dump())
        # Update treasury
        await treasuries.add_transaction(db, obj_in=transaction_create)
        # Store transaction using the super method
        transaction_created = await super().create(db, obj_in=transaction_create)
        # Get the items from the input data
        items: list[Item] = obj_in.items
        # Iterate over the items
        for item in items:
            # Get the CRUD utility corresponding to the item's table
            crud_table: CRUDBase = getattr(
                importlib.import_module(f"app.crud.crud_{item.table}"),
                item.table,
            )
            # Iterate over the number of items
            for _ in range(item.quantity):
                # Get the item's data
                item_data = item.computed_item
                # If the item is a consumable item, create a `ConsumableCreatePurchase` or `ConsumableCreateSale` object
                # from the item data depending on wheher the transaction is a sale or a purchase
                if item.table == "consumable":
                    if transaction_created.sale is True:
                        consumable_sale = ConsumableCreateSale(
                            **item_data.model_dump(),
                            transaction_id=transaction_created.id,
                        )
                        await crud_table.update(
                            db,
                            db_obj=(await crud_table.read(db, id=item_data.id)),  # type: ignore
                            obj_in=consumable_sale,
                        )
                    else:
                        consumable_purchase = ConsumableCreatePurchase(
                            **item_data.model_dump(),
                            transaction_id=transaction_created.id,
                        )
                        await crud_table.create(db, obj_in=consumable_purchase)

                else:
                    # Set the transaction id of the item data to the transaction's id
                    item_data.transaction_id = transaction_created.id
                    # Create a new item using the create method of the CRUD utility
                    await crud_table.create(db, obj_in=item_data)

        # Return the created transaction
        return transaction_created


transaction = CRUDTransaction(Transaction)
