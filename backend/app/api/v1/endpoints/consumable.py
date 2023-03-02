from fastapi import APIRouter, Depends, HTTPException, Security, status

from app.core.translation import Translator
from app.crud.crud_consumable import consumable as consumables
from app.dependencies import get_current_active_account, get_db
from app.schemas import consumable as consumable_schema


router = APIRouter(tags=["consumable"])
translator = Translator(element="consumable")


@router.get("/", response_model=list[consumable_schema.Consumable], dependencies=[Security(get_current_active_account)])
async def read_consumables(db=Depends(get_db), all: bool = False) -> list:
    return await consumables.query(db, limit=None) if all else await consumables.query(db, empty=False, limit=None)


@router.get("/distincts/", response_model=list[consumable_schema.Consumable], dependencies=[Security(get_current_active_account)])
async def read_consumables_distincts(db=Depends(get_db)) -> list:
    return await consumables.query(db, distinct='consumable_item_id', empty=False, limit=None)

@router.put("/{consumable_id}", response_model=consumable_schema.Consumable, dependencies=[Security(get_current_active_account)])
async def update_consumable(consumable_id: int, consumable: consumable_schema.ConsumableUpdate, db=Depends(get_db)) -> consumable_schema.Consumable:
    db_consumable = await consumables.read(db, consumable_id)
    if db_consumable is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND
        )
    return await consumables.update(db, db_obj=db_consumable, obj_in=consumable)