from humps import camelize
from pydantic import BaseModel, ConfigDict, Field


class DefaultModel(BaseModel):
    model_config = ConfigDict(alias_generator=camelize, populate_by_name=True)


ExcludedField = Field(default=None, exclude=True)
"""
Excluded field is used when a field is not needed in the response,
but is needed to compute other fields.
"""


class HTTPError(BaseModel):
    detail: str = Field(..., description="Error message.")
