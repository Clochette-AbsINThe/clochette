from fastapi import APIRouter, Depends, Security

from app.crud.crud_out_of_stock import out_of_stock as out_of_stocks
from app.dependencies import get_current_active_account, get_db
from app.schemas import out_of_stock as out_of_stock_schema

router = APIRouter(tags=["out_of_stock"], prefix="/out_of_stock")


@router.get(
    "/",
    response_model=list[out_of_stock_schema.OutOfStock],
    dependencies=[Security(get_current_active_account)],
)
async def read_out_of_stocks(db=Depends(get_db)):
    """
    Retrieve a list of out of stock items.
    """
    return await out_of_stocks.query(db, limit=None)
