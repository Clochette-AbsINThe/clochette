import logging

from fastapi import APIRouter, Depends, HTTPException, Security, status

from app.core.translation import Translator
from app.crud.crud_non_inventoried import non_inventoried as non_inventorieds
from app.dependencies import get_current_active_account, get_db
from app.schemas.v2 import non_inventoried as non_inventoried_schema

router = APIRouter(tags=["non_inventoried"], prefix="/non_inventoried")

translator = Translator(element="non_inventoried")
logger = logging.getLogger("app.api.v2.endpoints.non_inventoried")


@router.get(
    "/",
    response_model=list[non_inventoried_schema.NonInventoried],
    dependencies=[Security(get_current_active_account)],
)
async def read_non_inventorieds(db=Depends(get_db)):
    """
    Retrieve a list of non inventorieds.
    """
    return await non_inventorieds.query(db, limit=None)


@router.get(
    "/{non_inventoried_id}",
    response_model=non_inventoried_schema.NonInventoried,
    dependencies=[Security(get_current_active_account)],
)
async def read_non_inventoried(non_inventoried_id: int, db=Depends(get_db)):
    """
    Retrieve a non inventoried.
    """
    non_inventoried = await non_inventorieds.read(db, id=non_inventoried_id)
    if not non_inventoried:
        logger.debug(f"NonInventoried {non_inventoried_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND,
        )
    return non_inventoried


@router.post(
    "/",
    response_model=non_inventoried_schema.NonInventoried,
    dependencies=[Security(get_current_active_account)],
)
async def create_non_inventoried(
    non_inventoried: non_inventoried_schema.NonInventoriedCreate, db=Depends(get_db)
):
    """
    Create a new non inventoried.
    """
    return await non_inventorieds.create_v2(db, obj_in=non_inventoried)
