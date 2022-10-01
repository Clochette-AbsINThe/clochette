from pydantic import BaseModel


class ConsumableItemBase(BaseModel):
    name: str


class ConsumableItemCreate(ConsumableItemBase):
    pass


class ConsumableItemUpdate(ConsumableItemBase):
    pass


class ConsumableItem(ConsumableItemBase):
    id: int

    class Config:
        orm_mode = True
