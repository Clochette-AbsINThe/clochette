from fastapi import APIRouter, Depends, HTTPException

from app.crud.crud_consumable import consumable as consumables
from app.dependencies import get_db
from app.schemas import consumable as consumable_schema


router = APIRouter()


@router.get("/", response_model=list[consumable_schema.Consumable])
async def read_consumables(db=Depends(get_db)) -> list:
    return consumables.query(db, limit=None)