from fastapi import APIRouter, Security

from app.crud.crud_out_of_stock import out_of_stock as out_of_stocks
from app.dependencies import DBDependency, get_current_active_account
from app.schemas import out_of_stock as out_of_stock_schema

router = APIRouter(tags=["out_of_stock"], prefix="/out_of_stock")


@router.get(
    "/",
    response_model=list[out_of_stock_schema.OutOfStock],
    dependencies=[Security(get_current_active_account)],
)
async def read_out_of_stocks(db: DBDependency):
    """
    Retrieve a list of out of stock items.
    """
    return await out_of_stocks.query(db, limit=None)
