import logging

from fastapi import APIRouter, Depends, HTTPException, Security, status

from app.core.translation import Translator
from app.core.utils.misc import process_query_parameters, to_query_parameters
from app.crud.crud_out_of_stock import out_of_stock as out_of_stocks
from app.crud.crud_out_of_stock_item import out_of_stock_item as out_of_stock_items
from app.dependencies import get_current_active_account, get_db
from app.schemas import out_of_stock_item as out_of_stock_item_schema

router = APIRouter(tags=["out_of_stock_item"], prefix="/out_of_stock_item")
translator = Translator(element="out_of_stock_item")

logger = logging.getLogger("app.api.v1.out_of_stock_item")


@router.get(
    "/buy/",
    response_model=list[out_of_stock_item_schema.OutOfStockItem],
    dependencies=[Security(get_current_active_account)],
)
async def read_out_of_stock_items_buy(
    db=Depends(get_db),
    query=Depends(to_query_parameters(out_of_stock_item_schema.OutOfStockItemBase)),
):
    """
    Retrieve a list of out of stock items for buying.
    """
    query_parameters = process_query_parameters(query)
    logger.debug(f"Query parameters: {query_parameters}")
    return await out_of_stock_items.query(
        db, limit=None, buy_or_sell=True, **query_parameters
    )


@router.get(
    "/sell/",
    response_model=list[out_of_stock_item_schema.OutOfStockItem],
    dependencies=[Security(get_current_active_account)],
)
async def read_out_of_stock_items_sell(
    db=Depends(get_db),
    query=Depends(to_query_parameters(out_of_stock_item_schema.OutOfStockItemBase)),
):
    """
    Retrieve a list of out of stock items for selling.
    """
    query_parameters = process_query_parameters(query)
    logger.debug(f"Query parameters: {query_parameters}")
    return await out_of_stock_items.query(
        db, limit=None, buy_or_sell=False, **query_parameters
    )


@router.get(
    "/{out_of_stock_item_id}",
    response_model=out_of_stock_item_schema.OutOfStockItem,
    dependencies=[Security(get_current_active_account)],
)
async def read_out_of_stock_item(out_of_stock_item_id: int, db=Depends(get_db)):
    """
    Retrieve an out of stock item by ID.
    """
    out_of_stock_item = await out_of_stock_items.read(db, out_of_stock_item_id)
    if out_of_stock_item is None:
        logger.debug(f"Out of stock item {out_of_stock_item_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=translator.ELEMENT_NOT_FOUND
        )
    return out_of_stock_item


@router.post(
    "/",
    response_model=out_of_stock_item_schema.OutOfStockItem,
    dependencies=[Security(get_current_active_account)],
)
async def create_out_of_stock_item(
    out_of_stock_item: out_of_stock_item_schema.OutOfStockItemCreate,
    db=Depends(get_db),
):
    """
    Create a new out of stock item.
    """
    if await out_of_stock_items.query(
        db,
        limit=1,
        name=out_of_stock_item.name,
        buy_or_sell=out_of_stock_item.sell_price is None,
    ):
        logger.debug(f"Out of stock item {out_of_stock_item.name} already exists")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=translator.ELEMENT_ALREADY_EXISTS,
        )
    return await out_of_stock_items.create(db, obj_in=out_of_stock_item)


@router.put(
    "/{out_of_stock_item_id}",
    response_model=out_of_stock_item_schema.OutOfStockItem,
    dependencies=[Security(get_current_active_account)],
)
async def update_out_of_stock_item(
    out_of_stock_item_id: int,
    out_of_stock_item: out_of_stock_item_schema.OutOfStockItemUpdate,
    db=Depends(get_db),
):
    """
    Update an existing out of stock item.
    """
    old_out_of_stock_item = await out_of_stock_items.read(db, out_of_stock_item_id)
    if old_out_of_stock_item is None:
        logger.debug(f"Out of stock item {out_of_stock_item_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=translator.ELEMENT_NOT_FOUND
        )
    results = await out_of_stock_items.query(
        db,
        limit=1,
        name=out_of_stock_item.name,
        buy_or_sell=out_of_stock_item.sell_price is None,
    )
    if results and results[0].id != old_out_of_stock_item.id:
        logger.debug(f"Out of stock item {out_of_stock_item.name} already exists")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=translator.ELEMENT_ALREADY_EXISTS,
        )
    return await out_of_stock_items.update(
        db, db_obj=old_out_of_stock_item, obj_in=out_of_stock_item
    )


@router.delete(
    "/{out_of_stock_item_id}",
    response_model=out_of_stock_item_schema.OutOfStockItem,
    dependencies=[Security(get_current_active_account)],
)
async def delete_out_of_stock_item(out_of_stock_item_id: int, db=Depends(get_db)):
    """
    Delete an existing out of stock item.
    """
    if await out_of_stock_items.read(db, out_of_stock_item_id) is None:
        logger.debug(f"Out of stock item {out_of_stock_item_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=translator.ELEMENT_NOT_FOUND
        )
    if await out_of_stocks.query(db, limit=1, item_id=out_of_stock_item_id):
        logger.debug(f"Out of stock item {out_of_stock_item_id} is used")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=translator.DELETION_OF_USED_ELEMENT,
        )
    return await out_of_stock_items.delete(db, id=out_of_stock_item_id)
