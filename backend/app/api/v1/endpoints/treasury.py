from fastapi import APIRouter, Depends, HTTPException, status

from app.crud.crud_treasury import treasury as treasuries
from app.dependencies import get_current_account, get_db
from app.schemas import treasury as treasury_schema


router = APIRouter()


@router.get("/", response_model=list[treasury_schema.Treasury], dependencies=[Depends(get_current_account)])
async def read_treasuries(db=Depends(get_db)) -> list[treasury_schema.Treasury]:
    return treasuries.read_multi(db)


@router.post("/", response_model=treasury_schema.Treasury, dependencies=[Depends(get_current_account)])
async def create_treasury(treasury: treasury_schema.TreasuryCreate, db=Depends(get_db)) -> dict:
    # If a treasury already exists, raise an error
    if treasuries.read_multi(db):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Treasury already exists'
        )
    return treasuries.create(db, obj_in=treasury)