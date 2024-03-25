import importlib
from importlib.util import find_spec

from humps import pascalize
from pydantic import Field, FieldValidationInfo, computed_field, field_validator

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
            msg = f"No such table: {v}"
            raise ValueError(msg)
        if not hasattr(
            importlib.import_module(f"app.schemas.{v}"),
            "TransactionCreate",
        ):
            msg = f"Table {v} does not have a transaction scheme"
            raise ValueError(msg)
        return v

    quantity: int = Field(..., gt=0)
    item: dict | ConsumableCreate | OutOfStockCreate | BarrelCreate | GlassCreate

    @field_validator("item")
    @classmethod
    def check_table_scheme(cls, v, info: FieldValidationInfo):
        """
        The validator function checks if the given item is valid according to the table's scheme.
        """
        # Check if the 'table' key exists in the values dictionary,
        # which means that the 'table' field has been validated
        values = info.data
        if "table" not in values:
            return None
        # Get the transaction scheme for the given table
        transaction_scheme: DefaultModel = getattr(
            importlib.import_module(f'app.schemas.{values["table"]}'),
            f'{pascalize(values["table"])}Create',
        )
        # Parse the item using the transaction scheme
        transaction_scheme.model_validate(v)
        return v

    @computed_field  # type: ignore[misc]
    @property
    def computed_item(
        self,
    ) -> ConsumableCreate | OutOfStockCreate | BarrelCreate | GlassCreate:
        """
        This computed field returns the item according to the table.
        """
        # Get the transaction scheme for the given table
        transaction_scheme: DefaultModel = getattr(
            importlib.import_module(f"app.schemas.{self.table}"),
            f"{pascalize(self.table)}Create",
        )
        # Parse the item using the transaction scheme and return the result
        return transaction_scheme.model_validate(self.item)  # type: ignore
