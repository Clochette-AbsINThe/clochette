import logging
from copy import deepcopy
from datetime import datetime
from enum import Enum
from operator import gt, lt
from typing import Any, Dict, List, Optional, Tuple, Type

from pydantic import BaseModel, create_model
from pydantic.fields import Field, FieldInfo

from app.schemas.base import DefaultModel

logger = logging.getLogger("app.core.utils.misc")

ComparaisonSuffix = ["__gt", "__lt"]
ComparaisonTypes = (
    int,
    float,
    datetime,
    Optional[int],
    Optional[float],
    Optional[datetime],
)


def to_query_parameters(
    model: Type[DefaultModel],
    comparaison: bool = False,
    exclude: list[str] | None = None,
) -> type[BaseModel]:
    """Function that creates a new Pydantic model with all the fields of the original model,
    but with all fields optional.
    This is useful for creating query parameters that can be used to filter database queries.

    Args:
        model (Type[DefaultModel]): The base model to use.
        comparison (bool, optional): Whether to add comparison fields (key__gt, key__lt, etc.). Defaults to False.
        exclude (list[str], optional): The fields to exclude from the new model. Defaults to ["id", "password"].

    Returns:
        type[BaseModel]: The new Pydantic model.
    """
    if exclude is None:
        exclude = []

    exclude.extend(["id", "password"])

    # Create a dictionary of fields with their type and metadata
    fields: dict[str, Tuple[type[Any] | None, FieldInfo]] = {}
    # List of fields that have been extended with comparison fields
    fields_extended_with_comparison: list[str] = []

    # Iterate over the fields of the model and add them to the fields dictionary
    for key, value in model.model_fields.items():
        if key in exclude:
            continue

        if value.exclude:
            continue

        _type = value.annotation
        field: FieldInfo = Field(
            default=None, alias=key, alias_priority=1, validate_default=None
        )

        field.metadata = value.metadata
        field.rebuild_annotation()

        if _type in ComparaisonTypes and comparaison is True:
            for suffix in ComparaisonSuffix:
                field_copy = deepcopy(field)
                field_copy.alias = f"{key}{suffix}"
                fields[f"{key}{suffix}"] = (_type | None, field_copy)  # type: ignore
                fields_extended_with_comparison.append(key)

        fields[key] = (_type | None, field)  # type: ignore

    new_model: type[BaseModel] = create_model(f"{model.__name__}Query", **fields)  # type: ignore

    # This logic is used to copy the validators from the original model to the new model
    # This is needed because the validators are not copied by create_model
    # We iterate over the validators of the original model and add them to the new model if
    # the fields of the validator are in the fields of the new model + the comparison fields
    for (
        validator_name,
        validator,
    ) in model.__pydantic_decorators__.field_validators.items():
        # We get which fields the validator is applied to
        validator_fields = validator.info.fields

        # If any of the validator_fields is not in the fields of the model, skip it
        if any(_field not in fields for _field in validator_fields):
            continue

        # If we match a key which could has been extended with comparison fields, we need to add
        # the comparison fields to the new model validators fields
        _fields_to_adds: tuple[str, ...] = ()
        for _field in validator_fields:
            if _field in fields_extended_with_comparison:
                _fields_to_adds += tuple(
                    f"{_field}{suffix}" for suffix in ComparaisonSuffix
                )

        # We add the comparison fields to the validator
        validator.info.fields += _fields_to_adds

        # We add the validator to the new model
        new_model.__pydantic_decorators__.field_validators[validator_name] = validator

    # We copy the metadata, annotations and parent namespace of the original model to the new model
    # new_model.__pydantic_generic_metadata__ = model.__pydantic_generic_metadata__
    # new_model.__annotations__ = model.__annotations__
    new_model.__pydantic_parent_namespace__ = model.__pydantic_parent_namespace__

    # We rebuild the model to add the new fields
    new_model.model_rebuild(force=True)

    return new_model


def process_query_parameters(query_model: DefaultModel) -> dict[str, Any]:
    """
    Function that processes the query parameters.
    If comparison is True, there are multiple fields for comparison, like key__gt and key__lt.
    They will be converted as follows:
    key: {
        ">": value of key__gt,
        "<": value of key__lt
    }

    :param query_model: The query parameters
    :return: The processed query parameters
    """
    query_parameters = query_model.model_dump(exclude_none=True, exclude_unset=True)
    processed_query_parameters: dict[str, Any] = {}
    for key, value in query_parameters.items():
        if "__" in key:
            # If key is in the form of key__gt, key__lt, key__contains, etc.
            # Convert it to key: {">": value of key__gt, "<": value of key__lt}
            key, operator = key.split("__")

            if key not in processed_query_parameters:
                processed_query_parameters[key] = {}

            match operator:
                case "gt":
                    processed_query_parameters[key][gt] = value
                case "lt":
                    processed_query_parameters[key][lt] = value
                # Add default case
                case _:  # pragma: no cover
                    logger.warning(f"Unknown operator {operator} for key {key}")
        else:
            processed_query_parameters[key] = value
    return processed_query_parameters


def create_hierarchy_dict(enum: Type[Enum]) -> Dict[str, List[str]]:
    """
    Takes an Enum class and returns a dictionary mapping Enum values to lists of their ancestors in the Enum hierarchy.

    :param enum: The Enum class. It must have integer values and string names.
    :return: The dictionary mapping Enum values to lists of their ancestors in the Enum hierarchy
    """
    hierarchy_dict = {}
    for e in enum:
        # Get the list of ancestors for the current Enum value
        ancestors = [
            ancestor.name for ancestor in e.__class__ if ancestor.value < e.value
        ]
        # Add the current Enum value to the list of ancestors
        ancestors.append(e.name)
        # Add the list of ancestors to the hierarchy dictionary
        hierarchy_dict[e.name] = ancestors
    return hierarchy_dict
