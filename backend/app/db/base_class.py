from typing import Any
from sqlalchemy.ext.declarative import as_declarative, declared_attr


class_registry: dict = {}


@as_declarative(
    class_registry=class_registry
)
class Base:
    id: Any
    __name__: str

    # Generate __tablename__ automatically
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()
