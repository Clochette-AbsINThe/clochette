from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.types import SecurityScopes
from app.crud.crud_account import account as accounts
from app.crud.crud_out_of_stock_item import out_of_stock_item as out_of_stock_items
from app.crud.crud_treasury import treasury as treasuries
from app.db.session import SessionLocal
from app.schemas import(
    account as account_schema,
    out_of_stock_item as out_of_stock_item_schema,
    treasury as treasury_schema,
)


def init_db(db: Session = SessionLocal()) -> None:
    # Create treasury
    treasuries.create(
        db=db,
        obj_in=treasury_schema.TreasuryCreate(
            total_amount=0,
            cash_amount=0,
        )
    )
    # Create account
    accounts.create(
        db=db,
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
    db_obj = accounts.read(db=db, id=1) # First account to be created
    updated_account = account_schema.AccountUpdate(**account_schema.Account.from_orm(db_obj).dict(), password=db_obj.password)
    updated_account.is_active = True
    accounts.update(
        db=db,
        db_obj=db_obj,
        obj_in=updated_account,
    )
    # Create 2 ecocups (out of stock item), one of null€ and one of 1€
    out_of_stock_items.create(
        db=db,
        obj_in=out_of_stock_item_schema.OutOfStockItemCreate(
            name='EcoCup',
            icon='Glass',
        )
    )
    out_of_stock_items.create(
        db=db,
        obj_in=out_of_stock_item_schema.OutOfStockItemCreate(
            name='EcoCup',
            icon='Glass',
            sell_price=1,
        )
    )

