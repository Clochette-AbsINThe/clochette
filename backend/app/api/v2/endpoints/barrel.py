import logging

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
async def read_barrels(db=Depends(get_db), all: bool = False, mounted: bool = False):
    """
    Read barrels from the database.

    Args:
        - db: Database session dependency.
        - all: If True, return all barrels. If False, return only mounted or unmounted barrels
            depending on the `mounted` argument.
        - mounted: If True, return only mounted barrels. If False, return only unmounted barrels.

    Returns:
        A list of barrels.
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

    Args:
        - db: Database session dependency.

    Returns:
        A list of distinct barrels.
    """
    drink_id = barrel_model.Barrel.drink_item_id
    return await barrels.query(db, distinct=drink_id, empty_or_solded=False, limit=None)


@router.post(
    "/",
    response_model=barrel_schema.Barrel,
    dependencies=[Security(get_current_active_account)],
)
async def create_barrel(barrel: barrel_schema.BarrelCreate, db=Depends(get_db)):
    """
    Create a barrel in the database.

    Args:
        - barrel: The barrel data.
        - db: Database session dependency.

    Returns:
        The created barrel.
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

    Args:
        - barrel_id: The ID of the barrel to update.
        - barrel: The updated barrel data.
        - db: Database session dependency.

    Returns:
        The updated barrel.
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

    Args:
        - barrel_id: The ID of the barrel to update.
        - barrel: The updated barrel data.
        - db: Database session dependency.

    Returns:
        The updated barrel.
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
