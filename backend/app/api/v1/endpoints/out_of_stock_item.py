from fastapi import APIRouter, Depends, HTTPException

from app.crud.crud_out_of_stock_item import out_of_stock_item as out_of_stock_items
from app.dependencies import get_db
from app.schemas import out_of_stock_item as out_of_stock_item_schema


router = APIRouter()


@router.get("/buy", response_model=list[out_of_stock_item_schema.OutOfStockItemBuy])
async def read_out_of_stock_items_buy(db=Depends(get_db)) -> list:
    return out_of_stock_items.query(db, limit=None, buy_or_sell=True)


@router.post("/buy", response_model=out_of_stock_item_schema.OutOfStockItemBuy)
async def create_out_of_stock_item_buy(out_of_stock_item: out_of_stock_item_schema.OutOfStockItemBuyCreateFront, db=Depends(get_db)) -> dict:
    test = out_of_stock_items.query(db, limit=1, name=out_of_stock_item.name, buy_or_sell=True)
    if len(test) > 0:
        raise HTTPException(
            status_code=400, detail="Out of stock item already exists")
    saved_model = out_of_stock_item_schema.OutOfStockItemBuyCreate(**out_of_stock_item.dict())
    return out_of_stock_items.create(db, obj_in=saved_model)


@router.put("/buy/{out_of_stock_item_id}", response_model=out_of_stock_item_schema.OutOfStockItemBuy)
async def update_out_of_stock_item_buy(out_of_stock_item_id: int, out_of_stock_item: out_of_stock_item_schema.OutOfStockItemBuyUpdateFront, db=Depends(get_db)):
    test = out_of_stock_items.query(db, limit=1, name=out_of_stock_item.name, buy_or_sell=True)
    old_out_of_stock_item = out_of_stock_items.read(db, out_of_stock_item_id)
    if old_out_of_stock_item is None:
        raise HTTPException(
            status_code=404, detail="Out of stock item not found")
    if len(test) and test[0].id != old_out_of_stock_item.id:
        raise HTTPException(
            status_code=400, detail="Out of stock item already exists")
    saved_model = out_of_stock_item_schema.OutOfStockItemBuyUpdate(**out_of_stock_item.dict())
    return out_of_stock_items.update(db, db_obj=old_out_of_stock_item, obj_in=saved_model)


@router.delete("/buy/{out_of_stock_item_id}", response_model=out_of_stock_item_schema.OutOfStockItemBuy)
async def delete_out_of_stock_item_buy(out_of_stock_item_id: int, db=Depends(get_db)):
    out_of_stock_item = out_of_stock_items.read(db, out_of_stock_item_id)
    if out_of_stock_item is None:
        raise HTTPException(
            status_code=404, detail="Out of stock item not found")
    return out_of_stock_items.delete(db, id=out_of_stock_item_id)


@router.get("/sell", response_model=list[out_of_stock_item_schema.OutOfStockItemSell])
async def read_out_of_stock_items_sell(db=Depends(get_db)) -> list:
    return out_of_stock_items.query(db, limit=None, buy_or_sell=False)


@router.post("/sell", response_model=out_of_stock_item_schema.OutOfStockItemSell)
async def create_out_of_stock_item_sell(out_of_stock_item: out_of_stock_item_schema.OutOfStockItemSellCreateFront, db=Depends(get_db)) -> dict:
    test = out_of_stock_items.query(db, limit=1, name=out_of_stock_item.name, buy_or_sell=False)
    if len(test) > 0:
        raise HTTPException(
            status_code=400, detail="Out of stock item already exists")
    saved_model = out_of_stock_item_schema.OutOfStockItemSellCreate(**out_of_stock_item.dict())
    return out_of_stock_items.create(db, obj_in=saved_model)


@router.put("/sell/{out_of_stock_item_id}", response_model=out_of_stock_item_schema.OutOfStockItemSell)
async def update_out_of_stock_item_sell(out_of_stock_item_id: int, out_of_stock_item: out_of_stock_item_schema.OutOfStockItemSellUpdateFront, db=Depends(get_db)):
    test = out_of_stock_items.query(db, limit=1, name=out_of_stock_item.name, buy_or_sell=False)
    old_out_of_stock_item = out_of_stock_items.read(db, out_of_stock_item_id)
    if old_out_of_stock_item is None:
        raise HTTPException(
            status_code=404, detail="Out of stock item not found")
    if len(test) and test[0].id != old_out_of_stock_item.id:
        raise HTTPException(
            status_code=400, detail="Out of stock item already exists")
    saved_model = out_of_stock_item_schema.OutOfStockItemSellUpdate(**out_of_stock_item.dict())
    return out_of_stock_items.update(db, db_obj=old_out_of_stock_item, obj_in=saved_model)


@router.delete("/sell/{out_of_stock_item_id}", response_model=out_of_stock_item_schema.OutOfStockItemSell)
async def delete_out_of_stock_item_sell(out_of_stock_item_id: int, db=Depends(get_db)):
    out_of_stock_item = out_of_stock_items.read(db, out_of_stock_item_id)
    if out_of_stock_item is None:
        raise HTTPException(
            status_code=404, detail="Out of stock item not found")
    return out_of_stock_items.delete(db, id=out_of_stock_item_id)