import logging

from fastapi import APIRouter, Depends, HTTPException, Security, status

from app.core.translation import Translator
from app.crud.crud_consumable import consumable as consumables
from app.dependencies import get_current_active_account, get_db
from app.models import consumable as consumable_model
from app.schemas import consumable as consumable_schema

router = APIRouter(tags=["consumable"], prefix="/consumable", deprecated=True)
translator = Translator(element="consumable")

logger = logging.getLogger("app.api.v1.consumable")


@router.get(
    "/",
    response_model=list[consumable_schema.Consumable],
    dependencies=[Security(get_current_active_account)],
)
async def read_consumables(db=Depends(get_db), all: bool = False):
    """
    Retrieve a list of consumables.

    Args:
        db: The database connection dependency.
        all: A boolean indicating whether to return all consumables or only non-empty ones.

    Returns:
        A list of consumables.
    """
    logger.debug(f"all: {all}")
    if all:
        return await consumables.query(db, limit=None)

    return await consumables.query(db, solded=False, limit=None)


@router.get(
    "/distincts/",
    response_model=list[consumable_schema.Consumable],
    dependencies=[Security(get_current_active_account)],
)
async def read_consumables_distincts(db=Depends(get_db)):
    """
    Retrieve a list of distinct consumables.

    Args:
        db: The database connection dependency.

    Returns:
        A list of distinct consumables.
    """
    return await consumables.query(
        db,
        distinct=consumable_model.Consumable.consumable_item_id,
        solded=False,
        limit=None,
    )


@router.put(
    "/{consumable_id}",
    response_model=consumable_schema.Consumable,
    dependencies=[Security(get_current_active_account)],
)
async def update_consumable(
    consumable_id: int,
    consumable: consumable_schema.ConsumableUpdate,
    db=Depends(get_db),
):
    """
    Update a consumable.

    Args:
        consumable_id: The ID of the consumable to update.
        consumable: The updated consumable data.
        db: The database connection dependency.

    Returns:
        The updated consumable.
    """
    db_consumable = await consumables.read(db, consumable_id)
    if db_consumable is None:
        logger.debug(f"Consumable {consumable_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=translator.ELEMENT_NOT_FOUND
        )
    return await consumables.update(db, db_obj=db_consumable, obj_in=consumable)
