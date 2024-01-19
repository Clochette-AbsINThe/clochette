import logging

from fastapi import APIRouter, Depends, HTTPException, Security, status

from app.core.translation import Translator
from app.core.utils.misc import process_query_parameters, to_query_parameters
from app.crud.crud_glass import glass as glasses
from app.dependencies import get_current_active_account, get_db
from app.schemas.v2 import glass as glass_schema

router = APIRouter(tags=["glass"], prefix="/glass")

translator = Translator(element="glass")
logger = logging.getLogger("app.api.v2.glass")


@router.get(
    "/",
    response_model=list[glass_schema.Glass],
    dependencies=[Security(get_current_active_account)],
)
async def read_glasses(
    db=Depends(get_db), query=Depends(to_query_parameters(glass_schema.Glass))
):
    """
    Retrieve a list of glasses that match the given query parameters.
    """
    query_parameters = process_query_parameters(query)
    logger.debug(f"Query parameters: {query_parameters}")
    return await glasses.query(db, limit=None, **query_parameters)


@router.get(
    "/{glass_id}",
    response_model=glass_schema.Glass,
    dependencies=[Security(get_current_active_account)],
)
async def read_glass(glass_id: int, db=Depends(get_db)):
    """
    Retrieve a glass.
    """
    glass = await glasses.read(db, id=glass_id)
    if not glass:
        logger.debug(f"Glass {glass_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND,
        )
    return glass


@router.post(
    "/",
    response_model=glass_schema.Glass,
    dependencies=[Security(get_current_active_account)],
)
async def create_glass(glass: glass_schema.GlassCreate, db=Depends(get_db)):
    """
    Create a new glass in the database.
    """
    return await glasses.create_v2(db, obj_in=glass)
