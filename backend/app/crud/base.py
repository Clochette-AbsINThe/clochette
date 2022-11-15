from typing import Any, Generic, Optional, Type, TypeVar

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.decorator import handle_exceptions
from app.db.base_class import Base


ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class CRUDBase(
    Generic[
        ModelType,
        CreateSchemaType,
        UpdateSchemaType,
    ]
):
    def __init__(self, model: Type[ModelType]):
        """
        CRUD object with default methods to Create, Read, Update and Delete.

        :param model: A SQLAlchemy model class
        """
        self.model = model

    def read(self, db: Session, id: Any) -> Optional[ModelType]:
        """
        Get a record by id.

        :param db: The database session
        :param id: The record id

        :return: The record
        """
        return db.query(self.model).filter(self.model.id == id).first()

    def read_multi(self, db: Session, *, skip: int = 0, limit: int = 100) -> list[ModelType]:
        """
        Get multiple records.

        :param db: The database session
        :param skip: The number of records to skip
        :param limit: The number of records to return

        :return: The list of records
        """
        return db.query(self.model).offset(skip).limit(limit).all()

    def query(self, db: Session, distinct: str | None = None, skip: int = 0, limit: int = 100, **kwargs) -> list[ModelType]:
        """
        Get multiple records with filters and distinct option.

        :param db: The database session
        :param distinct: The distinct option, specify the column name
        :param skip: The number of records to skip
        :param limit: The number of records to return
        :param kwargs: The filters, should be in the form of {column_name: value}

        :return: The list of records
        """
        if distinct:
            return db.query(self.model).filter_by(**kwargs).distinct(distinct).offset(skip).limit(limit).all()
        return db.query(self.model).filter_by(**kwargs).offset(skip).limit(limit).all()

    @handle_exceptions('Data relationship integrity error', IntegrityError)
    def create(self, db: Session, *, obj_in: CreateSchemaType) -> ModelType:
        """
        Create a new record.

        :param db: The database session
        :param obj_in: The record data

        :return: The created record
        """
        obj_in_data = jsonable_encoder(obj_in, by_alias=False)
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    @handle_exceptions('Data relationship integrity error', IntegrityError)
    def update(self, db: Session, *, db_obj: ModelType, obj_in: UpdateSchemaType | dict[str, Any]) -> ModelType:
        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)

        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, *, id: int) -> ModelType:
        obj = db.query(self.model).get(id)
        db.delete(obj)
        db.commit()
        return obj
