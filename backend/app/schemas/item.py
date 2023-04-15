import importlib

from humps import pascalize
from pydantic import Field, validator

from app.core.config import DefaultModel



class Item(DefaultModel):
    table: str

    @validator('table')
    def does_this_table_exist(cls, v):
        """
        This validator function checks if the given table exists.
        """
        # Check if the table exists by trying to find its specification
        if (spec := importlib.util.find_spec(f'app.schemas.{v}')) is None:
            raise ValueError(f'No such table: {v}')
        return v

    @validator('table')
    def is_there_a_transaction_scheme(cls, v):
        """
        This validator function checks if the given table has a transaction scheme.
        """
        # Check if the table has a transaction scheme by trying to import it
        if not hasattr(importlib.import_module(f'app.schemas.{v}'), 'TransactionCreate'):
            raise ValueError(f'Table {v} does not have a transaction scheme')
        return v

    quantity: int = Field(..., gt=0)
    item: dict

    @validator('item')
    def check_table_scheme(cls, v, values):
        """
        The validator function checks if the given item is valid according to the table's scheme.
        """
        # Check if the 'table' key exists in the values dictionary, which means that the 'table' field has been validated
        if not 'table' in values.keys():
            return None
        # Get the transaction scheme for the given table
        transaction_scheme = getattr(importlib.import_module(f'app.schemas.{values["table"]}'), f'{pascalize(values["table"])}Create')
        # Parse the item using the transaction scheme and return the result
        return transaction_scheme.parse_obj(v)
