from datetime import datetime
from enum import Enum
from operator import gt, lt
from typing import Dict, List, Optional

import pytest
from pydantic import Field, field_validator

from app.core.utils.misc import (
    create_hierarchy_dict,
    process_query_parameters,
    to_query_parameters,
)
from app.schemas.base import DefaultModel


class User(DefaultModel):
    id: int
    password: str
    username: str
    email: str = Field(..., pattern=r"^\S+@\S+\.\S+$")
    created_at: datetime
    updated_at: Optional[datetime] = None
    test_int: int
    test_float: float

    @field_validator("test_int")
    def test_int_must_be_positive(cls, v: int) -> int:
        if v < 0:
            raise ValueError("test_int must be positive")
        return v


class QueryModelTest(DefaultModel):
    id__gt: Optional[int]
    name: Optional[str]
    created_at__gt: Optional[datetime]
    amount__lt: Optional[float]


class ExampleEnum(Enum):
    A = 1
    B = 2
    C = 3


def test_to_query_parameters():
    # Test without comparison
    NewModel = to_query_parameters(User)
    assert NewModel.model_fields.get("id", None) is None
    assert NewModel.model_fields.get("password", None) is None
    assert NewModel.model_fields["username"].is_required() is False
    assert NewModel.model_fields["email"].is_required() is False
    assert NewModel.model_fields["created_at"].is_required() is False
    assert NewModel.model_fields["updated_at"].is_required() is False
    assert NewModel.model_fields["test_int"].is_required() is False
    assert NewModel.model_fields["test_float"].is_required() is False
    assert (
        NewModel.__pydantic_decorators__.field_validators.get(
            "test_int_must_be_positive"
        )
        is not None
    )

    # Test with comparison
    NewModel = to_query_parameters(User, comparaison=True)
    assert NewModel.model_fields.get("id", None) is None
    assert NewModel.model_fields.get("password", None) is None
    assert NewModel.model_fields["username"].is_required() is False
    assert NewModel.model_fields["email"].is_required() is False
    assert NewModel.model_fields["created_at"].is_required() is False
    assert NewModel.model_fields["updated_at"].is_required() is False
    assert NewModel.model_fields["test_int"].is_required() is False
    assert NewModel.model_fields["test_float"].is_required() is False

    assert NewModel.model_fields["created_at__gt"].is_required() is False
    assert NewModel.model_fields["created_at__lt"].is_required() is False
    assert NewModel.model_fields["updated_at__gt"].is_required() is False
    assert NewModel.model_fields["updated_at__lt"].is_required() is False
    assert NewModel.model_fields["test_int__gt"].is_required() is False
    assert NewModel.model_fields["test_int__lt"].is_required() is False
    assert NewModel.model_fields["test_float__gt"].is_required() is False
    assert NewModel.model_fields["test_float__lt"].is_required() is False

    validator = NewModel.__pydantic_decorators__.field_validators.get(
        "test_int_must_be_positive"
    )
    assert validator is not None
    assert validator.info.fields == ("test_int", "test_int__gt", "test_int__lt")

    # Test with FieldMetadata
    NewModel = to_query_parameters(User)
    with pytest.raises(ValueError):
        NewModel(
            email="test",
        )


def test_process_query_parameters():
    # Test the process_query_parameters function
    query_parameters = {
        "id__gt": 1,
        "name": "john",
        "created_at__gt": "2022-01-01T00:00:00",
        "amount__lt": 100.0,
    }
    processed_query_parameters = process_query_parameters(
        QueryModelTest(**query_parameters)
    )
    assert processed_query_parameters == {
        "id": {gt: 1},
        "name": "john",
        "created_at": {gt: datetime(2022, 1, 1, 0, 0)},
        "amount": {lt: 100.0},
    }


def test_create_hierarchy_dict() -> None:
    expected_result: Dict[str, List[str]] = {
        "A": ["A"],
        "B": ["A", "B"],
        "C": ["A", "B", "C"],
    }
    assert create_hierarchy_dict(ExampleEnum) == expected_result
