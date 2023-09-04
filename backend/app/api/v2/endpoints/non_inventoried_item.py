import logging

from fastapi import APIRouter, Depends, HTTPException, Security, status

from app.core.translation import Translator
from app.core.types import TradeType
from app.crud.crud_non_inventoried import non_inventoried as non_inventorieds
from app.crud.crud_non_inventoried_item import (
    non_inventoried_item as non_inventoried_items,
)
from app.dependencies import get_current_active_account, get_db
from app.schemas.v2 import non_inventoried_item as non_inventoried_item_schema

router = APIRouter(tags=["non_inventoried_item"], prefix="/non_inventoried_item")

translator = Translator(element="non_inventoried_item")
logger = logging.getLogger("app.api.v2.endpoints.non_inventoried_item")


@router.get(
    "/",
    response_model=list[non_inventoried_item_schema.NonInventoriedItem],
    dependencies=[Security(get_current_active_account)],
)
async def read_non_inventoried_items(
    trade: TradeType, name: str | None = None, db=Depends(get_db)
):
    """
    Retrieve a list of non inventoried items.

    Query parameters:
        - `trade`: The trade type.
        - `name`: The non inventoried item name.
    """
    logger.debug(f"Trade: {trade}, name: {name}")
    return (
        await non_inventoried_items.query(db, limit=None, trade=trade)
        if name is None
        else await non_inventoried_items.query(db, limit=None, name=name, trade=trade)
    )


@router.get(
    "/{non_inventoried_item_id}",
    response_model=non_inventoried_item_schema.NonInventoriedItem,
    dependencies=[Security(get_current_active_account)],
)
async def read_non_inventoried_item(non_inventoried_item_id: int, db=Depends(get_db)):
    """
    Retrieve a non inventoried item.
    """
    non_inventoried_item = await non_inventoried_items.read(
        db, id=non_inventoried_item_id
    )
    if not non_inventoried_item:
        logger.debug(f"NonInventoriedItem {non_inventoried_item_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND,
        )
    return non_inventoried_item


@router.post(
    "/",
    response_model=non_inventoried_item_schema.NonInventoriedItem,
    dependencies=[Security(get_current_active_account)],
)
async def create_non_inventoried_item(
    non_inventoried_item: non_inventoried_item_schema.NonInventoriedItemCreate,
    db=Depends(get_db),
):
    """
    Create a non inventoried item.
    """
    if await non_inventoried_items.query(
        db, limit=1, name=non_inventoried_item.name, trade=non_inventoried_item.trade
    ):
        logger.debug(f"NonInventoriedItem {non_inventoried_item.name} already exists")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=translator.ELEMENT_ALREADY_EXISTS,
        )
    return await non_inventoried_items.create(db, obj_in=non_inventoried_item)


@router.patch(
    "/{non_inventoried_item_id}",
    response_model=non_inventoried_item_schema.NonInventoriedItem,
    dependencies=[Security(get_current_active_account)],
)
async def update_non_inventoried_item(
    non_inventoried_item_id: int,
    non_inventoried_item: non_inventoried_item_schema.NonInventoriedItemUpdate,
    db=Depends(get_db),
):
    """
    Update a non inventoried item.
    """
    old_non_inventoried_item = await non_inventoried_items.read(
        db, id=non_inventoried_item_id
    )
    if not old_non_inventoried_item:
        logger.debug(f"NonInventoriedItem {non_inventoried_item_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND,
        )
    results = await non_inventoried_items.query(
        db,
        limit=1,
        name=non_inventoried_item.name,
        trade=non_inventoried_item.trade,
    )
    if results and results[0].id != non_inventoried_item_id:
        logger.debug(f"NonInventoriedItem {non_inventoried_item.name} already exists")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=translator.ELEMENT_ALREADY_EXISTS,
        )
    return await non_inventoried_items.update(
        db, db_obj=old_non_inventoried_item, obj_in=non_inventoried_item
    )


@router.delete(
    "/{non_inventoried_item_id}",
    response_model=non_inventoried_item_schema.NonInventoriedItem,
    dependencies=[Security(get_current_active_account)],
)
async def delete_non_inventoried_item(
    non_inventoried_item_id: int,
    db=Depends(get_db),
):
    """
    Delete a non inventoried item.
    """
    if not await non_inventoried_items.read(db, id=non_inventoried_item_id):
        logger.debug(f"NonInventoriedItem {non_inventoried_item_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND,
        )
    if await non_inventorieds.query(
        db, limit=1, non_inventoried_item_id=non_inventoried_item_id
    ):
        logger.debug(
            f"NonInventoriedItem {non_inventoried_item_id} is used by a non inventoried"
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=translator.DELETION_OF_USED_ELEMENT,
        )
    return await non_inventoried_items.delete(db, id=non_inventoried_item_id)
