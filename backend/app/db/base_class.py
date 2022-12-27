from typing import Any
from sqlalchemy.ext.declarative import as_declarative, declared_attr


# Dictionary to store declarative classes
class_registry: dict = {}


# Decorate the `Base` class to make it a declarative base class
@as_declarative(
    class_registry=class_registry
)
class Base:
    # id field for all models
    id: Any
    # name of the class
    __name__: str

    # Generate __tablename__ automatically
    @declared_attr
    def __tablename__(cls) -> str:
        # Return the lowercase name of the class as the table name
        return cls.__name__.lower()
