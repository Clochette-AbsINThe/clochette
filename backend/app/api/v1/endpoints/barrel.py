from fastapi import APIRouter, Depends, HTTPException, Security, status

from app.core.translation import Translator
from app.crud.crud_barrel import barrel as barrels
from app.dependencies import get_current_active_account, get_db
from app.schemas import barrel as barrel_schema


router = APIRouter(tags=["barrel"])
translator = Translator(element="barrel")


@router.get("/", response_model=list[barrel_schema.Barrel], dependencies=[Security(get_current_active_account)])
async def read_barrels(db=Depends(get_db)) -> list:
    return await barrels.query(db, empty=False, limit=None)


@router.get("/mounted/", response_model=list[barrel_schema.Barrel], dependencies=[Security(get_current_active_account)])
async def read_mounted_barrels(db=Depends(get_db)) -> list:
    return await barrels.query(db, is_mounted=True, empty=False, limit=None)


@router.get("/distincts/", response_model=list[barrel_schema.Barrel], dependencies=[Security(get_current_active_account)])
async def read_distincts_barrels(db=Depends(get_db)) -> list:
    return await barrels.query(db, distinct='drink_id', empty=False, limit=None)


@router.get("/all/", response_model=list[barrel_schema.Barrel], dependencies=[Security(get_current_active_account)])
async def read_all_barrels(db=Depends(get_db)) -> list:
    return await barrels.query(db, limit=None)


@router.put("/{barrel_id}", response_model=barrel_schema.Barrel, dependencies=[Security(get_current_active_account)])
async def update_barrel(barrel_id: int, barrel: barrel_schema.BarrelUpdate, db=Depends(get_db)) -> barrel_schema.Barrel:
    db_barrel = await barrels.read(db, barrel_id)
    if db_barrel is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND
        )
    return await barrels.update(db, db_obj=db_barrel, obj_in=barrel)