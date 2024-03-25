import logging

from app.core.config import settings
from app.core.types import IconName, SecurityScopes
from app.crud.crud_account import account as accounts
from app.crud.crud_non_inventoried_item import (
    non_inventoried_item as non_inventoried_items,
)
from app.crud.crud_out_of_stock_item import out_of_stock_item as out_of_stock_items
from app.crud.crud_treasury import treasury as treasuries
from app.dependencies import get_db
from app.schemas import account as account_schema
from app.schemas import out_of_stock_item as out_of_stock_item_schema
from app.schemas import treasury as treasury_schema
from app.schemas.v2 import non_inventoried_item as non_inventoried_item_schema

logger = logging.getLogger("app.command")


async def init_db() -> None:
    logger.info("Creating initial data")

    async with get_db.get_session() as session:
        # Create treasury
        await treasuries.create(
            db=session,
            obj_in=treasury_schema.TreasuryCreate(
                total_amount=0,
                cash_amount=0,
                lydia_rate=0.015,  # Lydia take 1.5% of the transaction
            ),
        )
        logger.info("Treasury created")
        # Create account
        created_account = await accounts.create(
            db=session,
            obj_in=account_schema.AccountCreate(
                username=settings.BASE_ACCOUNT_USERNAME,
                password=settings.BASE_ACCOUNT_PASSWORD,
                last_name="Admin",
                first_name="Admin",
                promotion_year=2020,
            ),
        )
        logger.info("Base account created")
        updated_account = account_schema.AccountUpdate(
            **account_schema.Account.model_validate(created_account).model_dump(),
        )
        updated_account.is_active = True
        updated_account.scope = SecurityScopes.PRESIDENT
        await accounts.update(
            db=session,
            db_obj=created_account,
            obj_in=updated_account,
        )
        logger.info("Base account activated")
        # Create 2 ecocups (out of stock item), one of null€ and one of 1€
        await out_of_stock_items.create(
            db=session,
            obj_in=out_of_stock_item_schema.OutOfStockItemCreate(
                name="EcoCup",
                icon=IconName.GLASS,
            ),
        )
        await non_inventoried_items.create(
            db=session,
            obj_in=non_inventoried_item_schema.NonInventoriedItemCreate(
                name="EcoCup",
                icon=IconName.GLASS,
            ),
        )
        logger.info("EcoCup for buy created")
        await out_of_stock_items.create(
            db=session,
            obj_in=out_of_stock_item_schema.OutOfStockItemCreate(
                name="EcoCup",
                icon=IconName.GLASS,
                sell_price=1,
            ),
        )
        await non_inventoried_items.create(
            db=session,
            obj_in=non_inventoried_item_schema.NonInventoriedItemCreate(
                name="EcoCup",
                icon=IconName.GLASS,
                sell_price=1,
            ),
        )
        logger.info("EcoCup for sell created")

    logger.info("Initial data created")
