from fastapi import APIRouter, Depends, HTTPException, status

from app.crud.crud_out_of_stock_item import out_of_stock_item as out_of_stock_items
from app.crud.crud_out_of_stock import out_of_stock as out_of_stocks
from app.dependencies import get_db
from app.schemas import out_of_stock_item as out_of_stock_item_schema


router = APIRouter()


@router.get("/buy/", response_model=list[out_of_stock_item_schema.OutOfStockItem], response_model_exclude_none=True)
async def read_out_of_stock_items_buy(db=Depends(get_db)) -> list:
    return out_of_stock_items.query(db, limit=None, buy_or_sell=True)


@router.get("/sell/", response_model=list[out_of_stock_item_schema.OutOfStockItem], response_model_exclude_none=True)
async def read_out_of_stock_items_sell(db=Depends(get_db)) -> list:
    return out_of_stock_items.query(db, limit=None, buy_or_sell=False)


@router.get("/{out_of_stock_item_id}", response_model=out_of_stock_item_schema.OutOfStockItem, response_model_exclude_none=True)
async def read_out_of_stock_item(out_of_stock_item_id: int, db=Depends(get_db)) -> dict:
    out_of_stock_item = out_of_stock_items.read(db, out_of_stock_item_id)
    if out_of_stock_item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Out of stock item not found"
        )
    return out_of_stock_item


@router.post("/", response_model=out_of_stock_item_schema.OutOfStockItem, response_model_exclude_none=True)
async def create_out_of_stock_item(out_of_stock_item: out_of_stock_item_schema.OutOfStockItemCreateFront, db=Depends(get_db)) -> dict:
    if out_of_stock_items.query(db, limit=1, name=out_of_stock_item.name, buy_or_sell=out_of_stock_item.sell_price is None):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Out of stock item already exists"
        )
    saved_model = out_of_stock_item_schema.OutOfStockItemCreate(**out_of_stock_item.dict(), buy_or_sell=out_of_stock_item.sell_price is None)
    return out_of_stock_items.create(db, obj_in=saved_model.dict(by_alias=False))


@router.put("/{out_of_stock_item_id}", response_model=out_of_stock_item_schema.OutOfStockItem, response_model_exclude_none=True)
async def update_out_of_stock_item(out_of_stock_item_id: int, out_of_stock_item: out_of_stock_item_schema.OutOfStockItemUpdateFront, db=Depends(get_db)):
    old_out_of_stock_item = out_of_stock_items.read(db, out_of_stock_item_id)
    if old_out_of_stock_item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Out of stock item not found"
        )
    results = out_of_stock_items.query(db, limit=1, name=out_of_stock_item.name, buy_or_sell=out_of_stock_item.sell_price is None)
    if results and results[0].id != old_out_of_stock_item.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Out of stock item already exists"
        )
    saved_model = out_of_stock_item_schema.OutOfStockItemUpdate(**out_of_stock_item.dict(), buy_or_sell=out_of_stock_item.sell_price is None)
    return out_of_stock_items.update(db, db_obj=old_out_of_stock_item, obj_in=saved_model)


@router.delete("/{out_of_stock_item_id}", response_model=out_of_stock_item_schema.OutOfStockItem, response_model_exclude_none=True)
async def delete_out_of_stock_item(out_of_stock_item_id: int, db=Depends(get_db)):
    if out_of_stock_items.read(db, out_of_stock_item_id) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Out of stock item not found"
        )
    if out_of_stocks.query(db, limit=1, out_of_stock_item_id=out_of_stock_item_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Out of stock item is in use"
        )
    return out_of_stock_items.delete(db, id=out_of_stock_item_id)
