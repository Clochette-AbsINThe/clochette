from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any

from app.core.translation import Translator
from app.crud.crud_consumable_item import consumable_item as consumable_items
from app.crud.crud_consumable import consumable as consumables
from app.dependencies import get_current_account, get_db
from app.schemas import consumable_item as consumable_item_schema


router = APIRouter(tags=["consumable_item"])
translator = Translator(element="consumable_item")


@router.get("/", response_model=list[consumable_item_schema.ConsumableItem], dependencies=[Depends(get_current_account)])
async def read_consumable_items(db=Depends(get_db)) -> list:
    return consumable_items.read_multi(db)


@router.post("/", response_model=consumable_item_schema.ConsumableItem, dependencies=[Depends(get_current_account)])
async def create_consumable_item(consumable_item: consumable_item_schema.ConsumableItemCreate, db=Depends(get_db)) -> dict:
    if consumable_items.query(db, name=consumable_item.name, limit=1):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=translator.ELEMENT_ALREADY_EXISTS
        )
    return consumable_items.create(db, obj_in=consumable_item)


@router.get("/{consumable_item_id}", response_model=consumable_item_schema.ConsumableItem, dependencies=[Depends(get_current_account)])
async def read_consumable_item(consumable_item_id: int, db=Depends(get_db)) -> Any:
    consumable_item = consumable_items.read(db, consumable_item_id)
    if consumable_item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND
        )
    return consumable_item


@router.put("/{consumable_item_id}", response_model=consumable_item_schema.ConsumableItem, dependencies=[Depends(get_current_account)])
async def update_consumable_item(consumable_item_id: int, consumable_item: consumable_item_schema.ConsumableItemUpdate, db=Depends(get_db)):
    old_consumable_item = consumable_items.read(db, consumable_item_id)
    if old_consumable_item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND
        )
    results = consumable_items.query(db, name=consumable_item.name, limit=None)
    if results and results[0].id != old_consumable_item.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=translator.ELEMENT_ALREADY_EXISTS
        )
    return consumable_items.update(db, db_obj=old_consumable_item, obj_in=consumable_item)


@router.delete("/{consumable_item_id}", response_model=consumable_item_schema.ConsumableItem, dependencies=[Depends(get_current_account)])
async def delete_consumable_item(consumable_item_id: int, db=Depends(get_db)):
    if consumable_items.read(db, consumable_item_id) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND
        )
    if consumables.query(db, consumable_item_id=consumable_item_id, limit=1):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=translator.DELETION_OF_USED_ELEMENT
        )
    return consumable_items.delete(db, id=consumable_item_id)
