import importlib

from humps import pascalize
from pydantic import Field, validator

from app.core.config import DefaultModel



class Item(DefaultModel):
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

    quantity: int = Field(..., gt=0)
    item: dict

    @validator('item')
    def check_table_scheme(cls, v, values):
        if not 'table' in values.keys():
            return None
        transaction_scheme = getattr(importlib.import_module(f'app.schemas.{values["table"]}'), f'{pascalize(values["table"])}Create')
        return transaction_scheme.parse_obj(v)
