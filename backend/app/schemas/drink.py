from pydantic import BaseModel


class DrinkBase(BaseModel):
    name: str


class DrinkCreate(DrinkBase):
    pass


class DrinkUpdate(DrinkBase):
    pass


class Drink(DrinkBase):
    id: int

    class Config:
        orm_mode = True


class DrinkSearchResults(BaseModel):
    results: list[Drink]
