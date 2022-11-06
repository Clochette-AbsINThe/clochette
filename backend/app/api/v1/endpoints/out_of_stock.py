from fastapi import APIRouter, Depends, HTTPException

from app.crud.crud_out_of_stock import out_of_stock as out_of_stocks
from app.dependencies import get_db
from app.schemas import out_of_stock as out_of_stock_schema


router = APIRouter()


@router.get("/buy", response_model=list[out_of_stock_schema.OutOfStockBuy])
async def read_out_of_stocks_buy(db=Depends(get_db)) -> list:
    return out_of_stocks.query(db, limit=None)


@router.get("/sell", response_model=list[out_of_stock_schema.OutOfStockSell])
async def read_out_of_stocks_sell(db=Depends(get_db)) -> list:
    return out_of_stocks.query(db, limit=None)