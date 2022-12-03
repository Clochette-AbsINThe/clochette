from pydantic import create_model

from app.core.config import DefaultModel


def to_query_parameters(model: DefaultModel) -> DefaultModel:
    """
    Function to make every field of a Pydantic model optionnal.

    :param cls: The Pydantic model

    :return: The new Pydantic model
    """
    # Add all the fields of the original model to the new model
    fields = model.__fields__
    validators = {'__validators__': model.__validators__}
    optional_fields = {k: (v.type_ | None, None) for k, v in fields.items() if k != 'id' and k != 'password'} # Exclude id and password fields from being queried

    # Create a new Pydantic model
    # This model will have all the fields of the original model but they will all be optionnal
    new_model = create_model(model.__name__, **optional_fields, __validators__=validators)
            
    return new_model