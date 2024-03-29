import logging

from fastapi import APIRouter, HTTPException, Security, status

from app.core.translation import Translator
from app.crud.crud_barrel import barrel as barrels
from app.crud.crud_drink_item import drink_item as drinks
from app.dependencies import DBDependency, get_current_active_account
from app.schemas import drink_item as drink_schema

router = APIRouter(tags=["drink"], prefix="/drink")
translator = Translator(element="drink")

logger = logging.getLogger("app.api.v1.drink")


@router.get(
    "/{drink_id}",
    response_model=drink_schema.DrinkItem,
    dependencies=[Security(get_current_active_account)],
)
async def read_drink(drink_id: int, db: DBDependency):
    """
    Retrieve a drink by ID.
    """
    drink = await drinks.read(db, drink_id)
    if drink is None:
        logger.debug("Drink %s not found", drink_id)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND,
        )
    return drink


@router.get(
    "/",
    response_model=list[drink_schema.DrinkItem],
    dependencies=[Security(get_current_active_account)],
)
async def read_drinks(db: DBDependency):
    """
    Retrieve all drinks.
    """
    return await drinks.query(db, limit=None)


@router.post(
    "/",
    response_model=drink_schema.DrinkItem,
    dependencies=[Security(get_current_active_account)],
)
async def create_drink(drink: drink_schema.DrinkItemCreate, db: DBDependency):
    """
    Create a new drink.
    """
    # Check if drink already exists
    if await drinks.query(db, name=drink.name, limit=1):
        logger.debug("Drink %s already exists", drink.name)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=translator.ELEMENT_ALREADY_EXISTS,
        )
    return await drinks.create(db, obj_in=drink)


@router.put(
    "/{drink_id}",
    response_model=drink_schema.DrinkItem,
    dependencies=[Security(get_current_active_account)],
)
async def update_drink(
    drink_id: int,
    drink: drink_schema.DrinkItemUpdate,
    db: DBDependency,
):
    """
    Update a drink by ID.
    """
    old_drink = await drinks.read(db, drink_id)
    if old_drink is None:
        logger.debug("Drink %s not found", drink_id)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND,
        )
    results = await drinks.query(db, name=drink.name, limit=1)
    if results and results[0].id != old_drink.id:
        logger.debug("Drink %s already exists", drink.name)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=translator.ELEMENT_ALREADY_EXISTS,
        )
    return await drinks.update(db, db_obj=old_drink, obj_in=drink)


@router.delete(
    "/{drink_id}",
    response_model=drink_schema.DrinkItem,
    dependencies=[Security(get_current_active_account)],
)
async def delete_drink(drink_id: int, db: DBDependency):
    """
    Delete a drink by ID.
    """
    if await drinks.read(db, drink_id) is None:
        logger.debug("Drink %s not found", drink_id)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND,
        )
    if await barrels.query(db, drink_item_id=drink_id, limit=1):
        logger.debug("Drink %s is used by a barrel", drink_id)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=translator.DELETION_OF_USED_ELEMENT,
        )
    return await drinks.delete(db, id=drink_id)
