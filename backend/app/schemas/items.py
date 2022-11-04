import importlib
from typing import Any

from pydantic import BaseModel, ValidationError, validator



class Item(BaseModel):
    table: str

    @validator('table')
    def does_this_table_exist(cls, v):
        if (spec := importlib.util.find_spec(f'app.schemas.{v}')) is None:
            raise ValueError(f'No such table: {v}')
        return v

    @validator('table')
    def is_there_a_transaction_scheme(cls, v):
        if not hasattr(importlib.import_module(f'app.schemas.{v}'), 'TransactionCreate'):
            raise ValueError(f'Table {v} does not have a transaction scheme')
        return v

    quantity: int
    item: Any

    @validator('item')
    def check_table_scheme(cls, v, values, **kwargs):
        if not 'table' in values.keys():
            return None
        transaction_scheme = importlib.import_module(f'app.schemas.{values["table"]}')
        return transaction_scheme.TransactionCreate.parse_raw(v) 