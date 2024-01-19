import logging
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Security, status

from app.core.translation import Translator
from app.crud.crud_barrel import barrel as barrels
from app.dependencies import get_current_active_account, get_db
from app.models import barrel as barrel_model
from app.schemas.v2 import barrel as barrel_schema

router = APIRouter(tags=["barrel"], prefix="/barrel")
translator = Translator(element="barrel")

logger = logging.getLogger("app.api.v2.barrel")


@router.get(
    "/",
    response_model=list[barrel_schema.Barrel],
    dependencies=[Security(get_current_active_account)],
)
async def read_barrels(
    db=Depends(get_db),
    all: bool = False,
    is_mounted: bool | None = None,
    drink_item_id: int | None = None,
):
    """
    Read barrels from the database.

    Query parameters:
        - `all`: A boolean indicating whether to return all consumables or only non-empty ones.
        - `is_mounted`: If specified, if True, return only mounted barrels, else if False,
                return only unmounted barrels.
        - `drink_item_id`: If specified, return only barrels containing the specified drink item.
    """
    query_parameters: dict[str, Any] = {}
    if not all:
        query_parameters["empty_or_solded"] = False
    if is_mounted is not None:
        query_parameters["is_mounted"] = is_mounted
    if drink_item_id is not None:
        query_parameters["drink_item_id"] = drink_item_id

    logger.debug(f"Query parameters: {query_parameters}")
    return await barrels.query(db, limit=None, **query_parameters)


@router.get(
    "/distincts/",
    response_model=list[barrel_schema.BarrelDistinct],
    dependencies=[Security(get_current_active_account)],
)
async def read_distinct_barrels(db=Depends(get_db), is_mounted: bool | None = None):
    """
    Read distinct barrels from the database.

    Query parameters:
        - `is_mounted`: If specified, if True, return only mounted barrels, else if False,
                return only unmounted barrels.
    """
    query_parameters = {}
    if is_mounted is not None:
        query_parameters["is_mounted"] = is_mounted

    distinct_barrels = await barrels.query(
        db,
        distinct=barrel_model.Barrel.drink_item_id,
        empty_or_solded=False,
        limit=None,
        **query_parameters,
    )

    result = []
    for distinct_barrel in distinct_barrels:
        quantity = len(
            await barrels.query(
                db,
                drink_item_id=distinct_barrel.drink_item_id,
                empty_or_solded=False,
                **query_parameters,
            )
        )
        distinct_object = barrel_schema.BarrelDistinct.model_validate(
            {
                **distinct_barrel.dict(),
                "quantity": quantity,
            }
        )
        result.append(distinct_object)

    return result


@router.post(
    "/",
    response_model=barrel_schema.Barrel,
    dependencies=[Security(get_current_active_account)],
)
async def create_barrel(barrel: barrel_schema.BarrelCreate, db=Depends(get_db)):
    """
    Create a barrel in the database.
    """
    return await barrels.create_v2(db, obj_in=barrel)


@router.patch(
    "/{barrel_id}",
    response_model=barrel_schema.Barrel,
    dependencies=[Security(get_current_active_account)],
)
async def update_barrel(
    barrel_id: int, barrel: barrel_schema.BarrelUpdateModify, db=Depends(get_db)
):
    """
    Update a barrel in the database.
    """
    db_barrel = await barrels.read(db, barrel_id)
    if db_barrel is None:
        logger.debug(f"Barrel {barrel_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=translator.ELEMENT_NOT_FOUND
        )
    if db_barrel.empty_or_solded:
        logger.debug(f"Barrel {barrel_id} is empty or solded")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=translator.ELEMENT_NO_LONGER_IN_STOCK,
        )

    return await barrels.update(db, db_obj=db_barrel, obj_in=barrel)


@router.patch(
    "/{barrel_id}/sale",
    response_model=barrel_schema.Barrel,
    dependencies=[Security(get_current_active_account)],
)
async def sale_barrel(
    barrel_id: int, barrel: barrel_schema.BarrelUpdateSale, db=Depends(get_db)
):
    """
    Update a barrel in the database.
    """
    db_barrel = await barrels.read(db, barrel_id)
    if db_barrel is None:
        logger.debug(f"Barrel {barrel_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=translator.ELEMENT_NOT_FOUND
        )
    if db_barrel.empty_or_solded:
        logger.debug(f"Barrel {barrel_id} is empty or solded")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=translator.ELEMENT_NO_LONGER_IN_STOCK,
        )
    return await barrels.update_v2(db, db_obj=db_barrel, obj_in=barrel)
