from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import get_password_hash
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
            roles='admin', # Useless for now
            is_active=True,
            last_name='Admin',
            first_name='Admin',
            promotion_year=2020,
            staff_name='Admin',
            is_inducted=True,
        )
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

