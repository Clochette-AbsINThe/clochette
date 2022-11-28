from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any

from app.core.translation import Translator
from app.crud.crud_barrel import barrel as barrels
from app.crud.crud_drink import drink as drinks
from app.dependencies import get_current_account, get_db
from app.schemas import drink as drink_schema


router = APIRouter(tags=["drink"])
translator = Translator(element="drink")


@router.get("/{drink_id}", response_model=drink_schema.Drink, dependencies=[Depends(get_current_account)])
async def read_drink(drink_id: int, db=Depends(get_db)) -> Any:
    drink = drinks.read(db, drink_id)
    if drink is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND
        )
    return drink


@router.get("/", response_model=list[drink_schema.Drink], dependencies=[Depends(get_current_account)])
async def read_drinks(db=Depends(get_db)):
    return drinks.read_multi(db)


@router.post("/", response_model=drink_schema.Drink, dependencies=[Depends(get_current_account)])
async def create_drink(drink: drink_schema.DrinkCreate, db=Depends(get_db)) -> dict:
    # Check if drink already exists
    if drinks.query(db, name=drink.name, limit=1):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=translator.ELEMENT_ALREADY_EXISTS
        )
    return drinks.create(db, obj_in=drink)


@router.put("/{drink_id}", response_model=drink_schema.Drink, dependencies=[Depends(get_current_account)])
async def update_drink(drink_id: int, drink: drink_schema.DrinkUpdate, db=Depends(get_db)):
    old_drink = drinks.read(db, drink_id)
    if old_drink is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND
        )
    results = drinks.query(db, name=drink.name, limit=None)
    if results and results[0].id != old_drink.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=translator.ELEMENT_ALREADY_EXISTS
        )
    return drinks.update(db, db_obj=old_drink, obj_in=drink)


@router.delete("/{drink_id}", response_model=drink_schema.Drink, dependencies=[Depends(get_current_account)])
async def delete_drink(drink_id: int, db=Depends(get_db)):
    if drinks.read(db, drink_id) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND
        )
    if barrels.query(db, drink_id=drink_id, limit=1):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=translator.DELETION_OF_USED_ELEMENT
        )
    return drinks.delete(db, id=drink_id)
