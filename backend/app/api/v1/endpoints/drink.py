from fastapi import APIRouter, Depends, HTTPException

from app.crud.crud_drink import drink as drinks
from app.dependencies import get_db
from app.schemas import drink as drink_schema


router = APIRouter()


@router.get("/{drink_id}", response_model=drink_schema.Drink)
async def read_drink(drink_id: int, db=Depends(get_db)):
    drink = drinks.read(db, drink_id)
    if drink is None:
        raise HTTPException(status_code=404, detail="Drink not found")
    return drink


@router.get("/", response_model=list[drink_schema.Drink])
async def read_drinks(db=Depends(get_db)):
    return drinks.read_multi(db)


@router.post("/", response_model=drink_schema.Drink)
async def create_drink(drink: drink_schema.DrinkCreate, db=Depends(get_db)):
    #if drinks.read(db, drink.id):
    #    raise HTTPException(status_code=400, detail="Drink already exists")
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
