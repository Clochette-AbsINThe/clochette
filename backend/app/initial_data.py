from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.core.types import SecurityScopes
from app.crud.crud_account import account as accounts
from app.crud.crud_out_of_stock_item import out_of_stock_item as out_of_stock_items
from app.crud.crud_treasury import treasury as treasuries
from app.schemas import(
    account as account_schema,
    out_of_stock_item as out_of_stock_item_schema,
    treasury as treasury_schema,
)

async def init_db() -> None:
    engine = create_async_engine(
        settings.SQLALCHEMY_DATABASE_URI,
    )
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    # Create treasury
    await treasuries.create(
        db=async_session(),
        obj_in=treasury_schema.TreasuryCreate(
            total_amount=0,
            cash_amount=0,
        )
    )
    # Create account
    await accounts.create(
        db=async_session(),
        obj_in=account_schema.AccountCreate(
            username=settings.BASE_ACCOUNT_USERNAME,
            password=settings.BASE_ACCOUNT_PASSWORD,
            scope=SecurityScopes.president,
            last_name='Admin',
            first_name='Admin',
            promotion_year=2020,
            staff_name='Admin',
            is_inducted=True, # Will be set to False by pydantic
        )
    )
    # Activate account
    db_obj = await accounts.read(db=async_session(), id=1) # First account to be created
    updated_account = account_schema.AccountUpdate(**account_schema.Account.from_orm(db_obj).dict(), password=db_obj.password)
    updated_account.is_active = True
    await accounts.update(
        db=async_session(),
        db_obj=db_obj,
        obj_in=updated_account,
    )
    # Create 2 ecocups (out of stock item), one of null€ and one of 1€
    await out_of_stock_items.create(
        db=async_session(),
        obj_in=out_of_stock_item_schema.OutOfStockItemCreate(
            name='EcoCup',
            icon='Glass',
        )
    )
    await out_of_stock_items.create(
        db=async_session(),
        obj_in=out_of_stock_item_schema.OutOfStockItemCreate(
            name='EcoCup',
            icon='Glass',
            sell_price=1,
        )
    )
    await engine.dispose()
