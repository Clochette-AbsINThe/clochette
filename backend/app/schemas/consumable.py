from pydantic import BaseModel


class ConsumableBase(BaseModel):
    selling_price: float
    buying_price: float


class ConsumableCreate(ConsumableBase):
    pass


class ConsumableUpdate(ConsumableBase):
    pass


class Consumable(ConsumableBase):
    id: int
    transaction_id_purchase: int
    transaction_id_sale: int
    consumable_item_id: int
    stock_id: int
    selling_price: float
    buying_price: float

    class Config:
        orm_mode = True
