from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Any

from app.crud.crud_drink import drink as drinks
from app.dependencies import get_db
from app.schemas import drink as drink_schema


router = APIRouter()


@router.get("/search", response_model=drink_schema.DrinkSearchResults)
async def search_drinks(*, query: str | None = Query(None, min_length=3), limit: int | None = 10, db=Depends(get_db)) -> dict:
    drinks_found = drinks.read_multi(db)
    if not query:
        return {"results": drinks_found}
    results = filter(lambda drinks_found: query.lower() in drinks_found.name.lower(), drinks_found)
    return {"results": list(results)[:limit]}

@router.get("/{drink_id}", response_model=drink_schema.Drink)
async def read_drink(drink_id: int, db=Depends(get_db)) -> Any:
    drink = drinks.read(db, drink_id)
    if drink is None:
        raise HTTPException(status_code=404, detail="Drink not found")
    return drink


@router.get("/", response_model=list[drink_schema.Drink])
async def read_drinks(db=Depends(get_db)):
    return drinks.read_multi(db)


@router.post("/", response_model=drink_schema.Drink)
async def create_drink(drink: drink_schema.DrinkCreate, db=Depends(get_db)) -> dict:
    results = list(filter(lambda drinks_found: drink.name.lower() == drinks_found.name.lower(), drinks.read_multi(db)))[:1] # TODO: Improve this
    if len(results):
        raise HTTPException(status_code=400, detail="Drink already exists")
    return drinks.create(db, obj_in=drink)


@router.put("/{drink_id}", response_model=drink_schema.Drink)
async def update_drink(drink_id: int, drink: drink_schema.DrinkUpdate, db=Depends(get_db)):
    old_drink = drinks.read(db, drink_id)
    if old_drink is None:
        raise HTTPException(status_code=404, detail="Drink not found")
    return drinks.update(db, db_obj=old_drink, obj_in=drink)


@router.delete("/{drink_id}", response_model=drink_schema.Drink)
async def delete_drink(drink_id: int, db=Depends(get_db)):
    drink = drinks.read(db, drink_id)
    if drink is None:
        raise HTTPException(status_code=404, detail="Drink not found")
    return drinks.delete(db, id=drink_id)
