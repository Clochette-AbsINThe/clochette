from fastapi import APIRouter, Depends, HTTPException

from app.crud.crud_out_of_stock import out_of_stock as out_of_stocks
from app.dependencies import get_current_account, get_db
from app.schemas import out_of_stock as out_of_stock_schema


router = APIRouter()


@router.get("/", response_model=list[out_of_stock_schema.OutOfStock], response_model_exclude_none=True, dependencies=[Depends(get_current_account)])
async def read_out_of_stocks(db=Depends(get_db)) -> list:
    return out_of_stocks.query(db, limit=None)
