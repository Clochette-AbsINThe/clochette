from fastapi import APIRouter, Depends, HTTPException

from app.crud.crud_barrel import barrel as barrels
from app.dependencies import get_db
from app.schemas import barrel as barrel_schema


router = APIRouter()


@router.get("/", response_model=list[barrel_schema.Barrel])
async def read_barrels(db=Depends(get_db)) -> list:
    return barrels.query(db, limit=None)


@router.get("/mounted", response_model=list[barrel_schema.Barrel])
async def read_mounted_barrels(db=Depends(get_db)) -> list:
    return barrels.query(db, is_mounted=True, limit=None)


@router.put("/{barrel_id}", response_model=barrel_schema.Barrel)
async def update_barrel(barrel_id: int, barrel: barrel_schema.BarrelUpdate, db=Depends(get_db)) -> barrel_schema.Barrel:
    db_barrel = barrels.get(db, barrel_id)
    if db_barrel is None:
        raise HTTPException(status_code=404, detail="Barrel not found")
    return barrels.update(db, db_barrel, barrel)