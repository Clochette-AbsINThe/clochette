from fastapi import APIRouter, Depends, HTTPException

from app.crud.crud_consumable_item import consumable_item as consumable_items
from app.dependencies import get_db
from app.schemas import consumable_item as consumable_item_schema


router = APIRouter()


@router.get("/", response_model=list[consumable_item_schema.ConsumableItem])
async def read_consumable_items(db=Depends(get_db)) -> list:
    return consumable_items.read_multi(db)


@router.post("/", response_model=consumable_item_schema.ConsumableItem)
async def create_consumable_item(consumable_item: consumable_item_schema.ConsumableItemCreate, db=Depends(get_db)) -> dict:
    results = list(filter(lambda consumable_items_found: consumable_item.name.lower() == consumable_items_found.name.lower(), consumable_items.read_multi(db)))[:1] # TODO: Improve this
    if len(results):
        raise HTTPException(status_code=400, detail="Consumable item already exists")
    return consumable_items.create(db, obj_in=consumable_item)
