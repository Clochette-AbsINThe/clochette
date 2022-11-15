from fastapi import APIRouter, Depends, HTTPException
from typing import Any

from app.crud.crud_consumable_item import consumable_item as consumable_items
from app.crud.crud_consumable import consumable as consumables
from app.dependencies import get_db
from app.schemas import consumable_item as consumable_item_schema


router = APIRouter()


@router.get("/", response_model=list[consumable_item_schema.ConsumableItem])
async def read_consumable_items(db=Depends(get_db)) -> list:
    return consumable_items.read_multi(db)


@router.post("/", response_model=consumable_item_schema.ConsumableItem)
async def create_consumable_item(consumable_item: consumable_item_schema.ConsumableItemCreate, db=Depends(get_db)) -> dict:
    if consumable_items.query(db, name=consumable_item.name, limit=1):
        raise HTTPException(
            status_code=400, detail="Consumable item already exists")
    return consumable_items.create(db, obj_in=consumable_item)


@router.get("/{consumable_item_id}", response_model=consumable_item_schema.ConsumableItem)
async def read_consumable_item(consumable_item_id: int, db=Depends(get_db)) -> Any:
    consumable_item = consumable_items.read(db, consumable_item_id)
    if consumable_item is None:
        raise HTTPException(
            status_code=404, detail="Consumable item not found")
    return consumable_item


@router.put("/{consumable_item_id}", response_model=consumable_item_schema.ConsumableItem)
async def update_consumable_item(consumable_item_id: int, consumable_item: consumable_item_schema.ConsumableItemUpdate, db=Depends(get_db)):
    old_consumable_item = consumable_items.read(db, consumable_item_id)
    if old_consumable_item is None:
        raise HTTPException(
            status_code=404, detail="Consumabel Item not found")
    results = consumable_items.query(db, name=consumable_item.name, limit=None)
    if len(results) and results[0].id != old_consumable_item.id:
        raise HTTPException(
            status_code=400, detail="Consumable item already exists")
    return consumable_items.update(db, db_obj=old_consumable_item, obj_in=consumable_item)


@router.delete("/{consumable_item_id}", response_model=consumable_item_schema.ConsumableItem)
async def delete_consumable_item(consumable_item_id: int, db=Depends(get_db)):
    consumable_item = consumable_items.read(db, consumable_item_id)
    if consumable_item is None:
        raise HTTPException(
            status_code=404, detail="Consumable Item not found")
    if consumables.query(db, consumable_item_id=consumable_item_id, limit=1):
        raise HTTPException(
            status_code=400, detail="Consumable Item is in use")
    return consumable_items.delete(db, id=consumable_item_id)
