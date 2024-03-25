import logging

from fastapi import APIRouter, Depends, Security

from app.core.utils.misc import process_query_parameters, to_query_parameters
from app.crud.crud_glass import glass as glasses
from app.dependencies import DBDependency, get_current_active_account
from app.schemas import glass as glass_schema
from app.schemas.base import DefaultModel

router = APIRouter(tags=["glass"], prefix="/glass", deprecated=True)

logger = logging.getLogger("app.api.v1.glass")


@router.get(
    "/",
    response_model=list[glass_schema.Glass],
    dependencies=[Security(get_current_active_account)],
)
async def read_glasses(
    db: DBDependency,
    query: DefaultModel = Depends(to_query_parameters(glass_schema.Glass)),
):
    """
    Retrieve a list of glasses that match the given query parameters.
    """
    logger.debug("Query parameters: %s", query.model_extra)
    query_parameters = process_query_parameters(query)
    logger.debug("Query parameters: %s", query_parameters)
    return await glasses.query(db, limit=None, **query_parameters)
