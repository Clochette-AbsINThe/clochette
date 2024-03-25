import logging
from typing import Any

from fastapi import APIRouter, HTTPException, Security, status

from app.core.translation import Translator
from app.core.types import TradeType
from app.crud.crud_non_inventoried import non_inventoried as non_inventorieds
from app.crud.crud_non_inventoried_item import (
    non_inventoried_item as non_inventoried_items,
)
from app.dependencies import DBDependency, get_current_active_account
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
    db: DBDependency,
    trade: TradeType | None = None,
    name: str | None = None,
):
    """
    Retrieve a list of non inventoried items.

    Query parameters:
        - `trade`: The trade type.
        - `name`: The non inventoried item name.
    """
    logger.debug("Trade: %s, name: %s", trade, name)
    query_parameters: dict[str, Any] = {}
    if trade:
        query_parameters["trade"] = trade.value
    if name:
        query_parameters["name"] = name
    return await non_inventoried_items.query(db, limit=None, **query_parameters)


@router.get(
    "/{non_inventoried_item_id}",
    response_model=non_inventoried_item_schema.NonInventoriedItem,
    dependencies=[Security(get_current_active_account)],
)
async def read_non_inventoried_item(non_inventoried_item_id: int, db: DBDependency):
    """
    Retrieve a non inventoried item.
    """
    non_inventoried_item = await non_inventoried_items.read(
        db,
        id=non_inventoried_item_id,
    )
    if not non_inventoried_item:
        logger.debug("NonInventoriedItem %s not found", non_inventoried_item_id)
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
    db: DBDependency,
):
    """
    Create a non inventoried item.
    """
    if await non_inventoried_items.query(
        db,
        limit=1,
        name=non_inventoried_item.name,
        trade=non_inventoried_item.trade,
    ):
        logger.debug("NonInventoriedItem %s already exists", non_inventoried_item.name)
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
    db: DBDependency,
):
    """
    Update a non inventoried item.
    """
    old_non_inventoried_item = await non_inventoried_items.read(
        db,
        id=non_inventoried_item_id,
    )
    if not old_non_inventoried_item:
        logger.debug("NonInventoriedItem %s not found", non_inventoried_item_id)
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
        logger.debug("NonInventoriedItem %s already exists", non_inventoried_item.name)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=translator.ELEMENT_ALREADY_EXISTS,
        )
    return await non_inventoried_items.update(
        db,
        db_obj=old_non_inventoried_item,
        obj_in=non_inventoried_item,
    )


@router.delete(
    "/{non_inventoried_item_id}",
    response_model=non_inventoried_item_schema.NonInventoriedItem,
    dependencies=[Security(get_current_active_account)],
)
async def delete_non_inventoried_item(
    non_inventoried_item_id: int,
    db: DBDependency,
):
    """
    Delete a non inventoried item.
    """
    if not await non_inventoried_items.read(db, id=non_inventoried_item_id):
        logger.debug("NonInventoriedItem %s not found", non_inventoried_item_id)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND,
        )
    if await non_inventorieds.query(
        db,
        limit=1,
        non_inventoried_item_id=non_inventoried_item_id,
    ):
        logger.debug(
            "NonInventoriedItem %s is used by a non inventoried",
            non_inventoried_item_id,
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=translator.DELETION_OF_USED_ELEMENT,
        )
    return await non_inventoried_items.delete(db, id=non_inventoried_item_id)
