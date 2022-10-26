from fastapi import APIRouter, Depends, HTTPException

from app.crud.crud_barrel import barrel as barrels
from app.dependencies import get_db
from app.schemas import barrel as barrel_schema


router = APIRouter()


@router.get("/", response_model=list[barrel_schema.Barrel])
async def read_barrels(db=Depends(get_db)) -> list:
    return barrels.query(db, limit=None)