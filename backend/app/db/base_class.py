from typing import TYPE_CHECKING, Any, Type, TypeVar

from annotated_types import T
from sqlalchemy.orm import as_declarative, declared_attr

# Dictionary to store declarative classes
class_registry: dict = {}

_T = TypeVar("_T", bound="Base")


# Decorate the `Base` class to make it a declarative base class
@as_declarative(class_registry=class_registry)
class Base:
    # id field for all models
    id: Any
    # name of the class
    __name__: str

    # Generate __tablename__ automatically
    @declared_attr.directive
    def __tablename__(cls) -> str:
        return cls.__name__.lower()

    @classmethod
    def create(cls: Type[_T], **kwargs: Any) -> _T:
        """
        Create a new instance of the class and set its attributes based on the provided keyword arguments.
        This is used in the tests to create new instances of the model classes.

        :param kwargs: The keyword arguments to set as attributes on the new instance.
        :return: The new instance of the class.
        :raises ValueError: If a provided keyword argument is not a valid attribute for the class.
        """
        instance = cls()
        for key, value in kwargs.items():
            if hasattr(instance, key):
                setattr(instance, key, value)
            else:
                raise ValueError(
                    f"{key} is not a valid attribute for {instance.__class__.__name__}"
                )
        return instance


if TYPE_CHECKING:
    from sqlalchemy.sql.type_api import TypeEngine

    class Enum(TypeEngine[T]):
        def __init__(self, enum: Type[T]) -> None:
            ...

else:
    from sqlalchemy import Enum  # noqa: F401
