from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Any

from app.crud.crud_consumable_item import consumable_item as consumable_items
from app.dependencies import get_db
from app.schemas import consumable_item as consumable_item_schema


router = APIRouter()


@router.get("/", response_model=list[consumable_item_schema.ConsumableItem])
async def read_consumable_items(db=Depends(get_db)) -> list:
    return consumable_items.read_multi(db)