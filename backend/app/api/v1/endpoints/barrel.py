import logging

from fastapi import APIRouter, Depends, HTTPException, Security, status

from app.core.translation import Translator
from app.crud.crud_barrel import barrel as barrels
from app.dependencies import get_current_active_account, get_db
from app.models import barrel as barrel_model
from app.schemas import barrel as barrel_schema

router = APIRouter(tags=["barrel"], prefix="/barrel", deprecated=True)
translator = Translator(element="barrel")

logger = logging.getLogger("app.api.v1.barrel")


@router.get(
    "/",
    response_model=list[barrel_schema.Barrel],
    dependencies=[Security(get_current_active_account)],
)
async def read_barrels(db=Depends(get_db), all: bool = False, mounted: bool = False):
    """
    Read barrels from the database.

    Query parameters:
        - `all`: If True, return all barrels. If False, return only mounted or unmounted barrels.
        - `mounted`: If True, return only mounted barrels. If False, return only unmounted barrels.
    """
    logger.debug(f"all: {all}, mounted: {mounted}")
    return (
        await barrels.query(db, limit=None)
        if all
        else await barrels.query(
            db, is_mounted=mounted, empty_or_solded=False, limit=None
        )
    )


@router.get(
    "/distincts/",
    response_model=list[barrel_schema.Barrel],
    dependencies=[Security(get_current_active_account)],
)
async def read_distinct_barrels(db=Depends(get_db)):
    """
    Read distinct barrels from the database.
    """
    drink_id = barrel_model.Barrel.drink_item_id
    return await barrels.query(db, distinct=drink_id, empty_or_solded=False, limit=None)


@router.put(
    "/{barrel_id}",
    response_model=barrel_schema.Barrel,
    dependencies=[Security(get_current_active_account)],
)
async def update_barrel(
    barrel_id: int, barrel: barrel_schema.BarrelUpdate, db=Depends(get_db)
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
    return await barrels.update(db, db_obj=db_barrel, obj_in=barrel)
