from datetime import datetime
from enum import Enum
from operator import gt, lt
from pydantic import create_model

from app.core.config import DefaultModel


def to_query_parameters(model: DefaultModel, comparison: bool = False) -> DefaultModel:
    """
    Function to make every field of a Pydantic model optionnal.

    :param cls: The Pydantic model

    :return: The new Pydantic model
    """
    # Add all the fields of the original model to the new model
    fields = model.__fields__
    validators = {'__validators__': model.__validators__}
    optional_fields = {}
    for key, value in fields.items():
        if key != 'id' and key != 'password': # Exclude id and password fields from being queried
            if comparison:
                # If type is datetime, create multiple fields for comparison
                # Example: created_at__gt, created_at__lt
                if value.type_ == datetime:
                    optional_fields[f'{key}__gt'] = (datetime | None, None)
                    optional_fields[f'{key}__lt'] = (datetime | None, None)
                # If type is int, create multiple fields for comparison
                # Example: id__gt, id__lt
                elif value.type_ == int:
                    optional_fields[f'{key}__gt'] = (int | None, None)
                    optional_fields[f'{key}__lt'] = (int | None, None)
                # If type is float, create multiple fields for comparison
                # Example: amount__gt, amount__lt
                elif value.type_ == float:
                    optional_fields[f'{key}__gt'] = (float | None, None)
                    optional_fields[f'{key}__lt'] = (float | None, None)
                else:
                    optional_fields[f'{key}'] = (value.type_ | None, None)
            else:
                optional_fields[f'{key}'] = (value.type_ | None, None)

    # Create a new Pydantic model
    # This model will have all the fields of the original model but they will all be optionnal
    new_model = create_model(model.__name__, **optional_fields, __validators__=validators)
            
    return new_model


def process_query_parameters(query_model: DefaultModel) -> dict:
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
    query_parameters = query_model.dict(exclude_none=True, exclude_unset=True)
    processed_query_parameters = {}
    for key, value in query_parameters.items():
        if '__' in key:
            # If key is in the form of key__gt, key__lt, key__contains, etc.
            # Convert it to key: {">": value of key__gt, "<": value of key__lt}
            key, operator = key.split('__')
            if key not in processed_query_parameters:
                processed_query_parameters[key] = {}
            processed_query_parameters[key][gt if operator == 'gt' else lt] = value
        else:
            processed_query_parameters[key] = value
    return processed_query_parameters


def convert_enum_to_str(cls: Enum, name: str) -> Enum:
    """
    Function to convert an Enum class to an Enum class with string values that are field names.

    :param cls: The Enum class
    :return: The new Enum class
    """
    return Enum(name, {item.name: item.name for item in cls})


def create_hierarchy_dict(enum: Enum) -> dict[str, list[str]]:
    """
    Takes an Enum class and returns a dictionary mapping Enum values to lists of their ancestors in the Enum hierarchy.

    :param enum: The Enum class. It must have integer values and string names.
    :return: The dictionary mapping Enum values to lists of their ancestors in the Enum hierarchy
    """
    hierarchy_dict = {}
    for e in enum:
        # Get the list of ancestors for the current Enum value
        ancestors = [ancestor.name for ancestor in e.__class__ if ancestor.value < e.value]
        # Add the current Enum value to the list of ancestors
        ancestors.append(e.name)
        # Add the list of ancestors to the hierarchy dictionary
        hierarchy_dict[e.name] = ancestors
    return hierarchy_dict