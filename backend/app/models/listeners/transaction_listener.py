"""
This module contains SQLAlchemy event listeners for the Transaction model.
The listeners prevent deletion of transactions that have associated consumable or barrel sales.
"""

import logging

from sqlalchemy import Connection, event
from sqlalchemy.orm import Mapper

from app.core.decorator import handle_exceptions
from app.core.translation import Translator
from app.models.transaction import Transaction

logger = logging.getLogger("app.models.listeners.transaction_listener")

barrel_translator = Translator("barrel")
consumable_translator = Translator("consumable")


class InvalidTransaction(Exception):
    pass


@handle_exceptions(
    consumable_translator.DELETION_OF_USED_ELEMENT, InvalidTransaction, sync_func=True
)
def prevent_consumables_deletion(target: Transaction):
    """Check if any associated consumables are referenced in sale transactions."""
    if any(
        consumable.transaction_id_sale for consumable in target.consumables_purchase
    ):
        logger.debug("Preventing transaction deletion for consumable")
        raise InvalidTransaction(
            "Cannot delete transaction with associated consumable sales"
        )


@handle_exceptions(
    barrel_translator.DELETION_OF_USED_ELEMENT, InvalidTransaction, sync_func=True
)
def prevent_barrels_deletion(target: Transaction):
    """Check if any associated barrels are referenced in sale transactions."""
    if any(barrel.transaction_id_sale for barrel in target.barrels_purchase):
        logger.debug("Preventing transaction deletion for barrel")
        raise InvalidTransaction(
            "Cannot delete transaction with associated barrel sales"
        )


@event.listens_for(Transaction, "before_delete")
def prevent_transaction_deletion(
    _mapper: Mapper[Transaction], _connection: Connection, target: Transaction
):
    """
    Prevent deletion of transactions that have associated consumable or barrel sales.
    """
    prevent_consumables_deletion(target)
    prevent_barrels_deletion(target)
