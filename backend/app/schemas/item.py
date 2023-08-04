import importlib
from importlib.util import find_spec

from pydantic import Field, field_validator

from app.schemas.barrel import BarrelCreate
from app.schemas.base import DefaultModel
from app.schemas.consumable import ConsumableCreate
from app.schemas.glass import GlassCreate
from app.schemas.out_of_stock import OutOfStockCreate


class Item(DefaultModel):
    table: str

    @field_validator("table", mode="before")
    @classmethod
    def validate_table(cls, v):
        """
        This validator function checks if the given table exists. and if it has a transaction scheme.
        """
        # Check if the table exists by trying to find its specification
        if find_spec(f"app.schemas.{v}") is None:
            raise ValueError(f"No such table: {v}")
        if not hasattr(
            importlib.import_module(f"app.schemas.{v}"), "TransactionCreate"
        ):
            raise ValueError(f"Table {v} does not have a transaction scheme")
        return v

    quantity: int = Field(..., gt=0)
    item: ConsumableCreate | OutOfStockCreate | BarrelCreate | GlassCreate
