from fastapi import APIRouter, Depends, HTTPException

from app.crud.crud_glass import glass as glasses
from app.dependencies import get_db
from app.schemas import glass as glass_schema


router = APIRouter()


@router.get("/", response_model=list[glass_schema.Glass], dependencies=[Depends(get_db)])
async def read_glasses(db=Depends(get_db)) -> list:
    return glasses.query(db, limit=None)