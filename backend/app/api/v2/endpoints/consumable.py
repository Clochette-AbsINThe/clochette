import logging

from fastapi import APIRouter, HTTPException, Security, status

from app.core.translation import Translator
from app.crud.crud_consumable import consumable as consumables
from app.dependencies import DBDependency, get_current_active_account
from app.models import consumable as consumable_model
from app.schemas.v2 import consumable as consumable_schema

router = APIRouter(tags=["consumable"], prefix="/consumable")
translator = Translator(element="consumable")

logger = logging.getLogger("app.api.v2.consumable")


@router.get(
    "/",
    response_model=list[consumable_schema.Consumable],
    dependencies=[Security(get_current_active_account)],
)
async def read_consumables(
    db: DBDependency,
    all: bool = False,
    consumable_item_id: int | None = None,
):
    """
    Retrieve a list of consumables.

    Query parameters:
        - `all`: A boolean indicating whether to return all consumables or only non-empty ones.
    """
    query_parameters = {}
    if consumable_item_id:
        query_parameters["consumable_item_id"] = consumable_item_id
    if not all:
        query_parameters["solded"] = False
    logger.debug("Query parameters: %s", query_parameters)

    return await consumables.query(db, limit=None, **query_parameters)


@router.get(
    "/{consumable_id}",
    response_model=consumable_schema.Consumable,
    dependencies=[Security(get_current_active_account)],
)
async def read_consumable(consumable_id: int, db: DBDependency):
    """
    Retrieve a consumable.
    """
    db_consumable = await consumables.read(db, consumable_id)
    if db_consumable is None:
        logger.debug("Consumable %s not found", consumable_id)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND,
        )
    return db_consumable


@router.get(
    "/distincts/",
    response_model=list[consumable_schema.ConsumableDistinct],
    dependencies=[Security(get_current_active_account)],
)
async def read_distinct_consumables(db: DBDependency):
    """
    Retrieve a list of distinct consumables.
    """
    distinct_consumables = await consumables.query(
        db,
        distinct=consumable_model.Consumable.consumable_item_id,
        solded=False,
        limit=None,
    )

    result = []
    for distinct_consumable in distinct_consumables:
        quantity = len(
            await consumables.query(
                db,
                consumable_item_id=distinct_consumable.consumable_item_id,
                solded=False,
            ),
        )
        distinct_object = consumable_schema.ConsumableDistinct.model_validate(
            {
                **distinct_consumable.dict(),
                "quantity": quantity,
            },
        )
        result.append(distinct_object)

    return result


@router.post(
    "/",
    response_model=consumable_schema.Consumable,
    dependencies=[Security(get_current_active_account)],
)
async def create_consumable(
    consumable: consumable_schema.ConsumableCreate,
    db: DBDependency,
):
    """
    Create a consumable.
    """
    return await consumables.create_v2(db, obj_in=consumable)


@router.patch(
    "/{consumable_id}",
    response_model=consumable_schema.Consumable,
    dependencies=[Security(get_current_active_account)],
)
async def update_consumable(
    consumable_id: int,
    consumable: consumable_schema.ConsumableUpdateModify,
    db: DBDependency,
):
    """
    Update a consumable.
    """
    db_consumable = await consumables.read(db, consumable_id)
    if db_consumable is None:
        logger.debug("Consumable %s not found", consumable_id)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND,
        )
    if db_consumable.solded:
        logger.debug("Consumable %s already solded", consumable_id)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=translator.ELEMENT_NO_LONGER_IN_STOCK,
        )
    return await consumables.update(db, db_obj=db_consumable, obj_in=consumable)


@router.patch(
    "/{consumable_id}/sale",
    response_model=consumable_schema.Consumable,
    dependencies=[Security(get_current_active_account)],
)
async def sale_consumable(
    consumable_id: int,
    consumable: consumable_schema.ConsumableUpdateSale,
    db: DBDependency,
):
    """
    Sale a consumable.
    """
    db_consumable = await consumables.read(db, consumable_id)
    if db_consumable is None:
        logger.debug("Consumable %s not found", consumable_id)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND,
        )
    if db_consumable.solded:
        logger.debug("Consumable %s already solded", consumable_id)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=translator.ELEMENT_NO_LONGER_IN_STOCK,
        )
    return await consumables.update_v2(db, db_obj=db_consumable, obj_in=consumable)
