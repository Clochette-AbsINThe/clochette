from typing import Any, Generic, Optional, Type, TypeVar

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.decorator import handle_exceptions
from app.core.translation import Translator
from app.db.base_class import Base


translator = Translator()

ModelType = TypeVar("ModelType", bound=Base) # SQLAlchemy model representing the object
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel) # Pydantic validation schema for creating the object
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel) # Pydantic validation schema for updating the object


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

    def query(self, db: Session, distinct: str | None = None, skip: int = 0, limit: int = 100, **filters) -> list[ModelType]:
        """
        Get multiple records with filters and distinct option.

        :param db: The database session
        :param distinct: The distinct option, specify the column name
        :param skip: The number of records to skip
        :param limit: The number of records to return
        :param filters: The filters, should be in the form of {column_name: value}

        :return: The list of records
        """

        # The function first creates a query object using the db.query method, and then
        # iterates over the filters to apply them to the query using the query.filter method.
        # The query.distinct method is used to apply the DISTINCT option if specified, and
        # the query.offset and query.limit methods are used to apply the skip and
        # limit parameters. Finally, the query.all method is used to execute the query and
        # return the results as a list of records.

        query = db.query(self.model)

        for column, value in filters.items():
            if isinstance(value, dict): # Check whether the value of the filter is a dictionary
                for operator, operand in value.items(): # Iterate over the items in the value dictionary, which should contain operator-operand pairs
                    # The operator variable is used to specify the operator to use in the filter
                    # (e.g. > and <), and the operand variable is used as the operand for
                    # the filter. For example, if the value dictionary contained the items {gt: 10}, (the optator comes from the operator module)
                    # the filter applied would be column > 10.
                    query = query.filter(operator(getattr(self.model, column), operand))
            else:
                query = query.filter(getattr(self.model, column) == value)

        if distinct:
            query = query.distinct(distinct)

        return query.offset(skip).limit(limit).all()

    @handle_exceptions(translator.INTEGRITY_ERROR, IntegrityError)
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

    @handle_exceptions(translator.INTEGRITY_ERROR, IntegrityError)
    def update(self, db: Session, *, db_obj: ModelType, obj_in: UpdateSchemaType | dict[str, Any]) -> ModelType:
        """
        Update a record.

        :param db: The database session
        :param db_obj: The record to update
        :param obj_in: The record data

        :return: The updated record
        """

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
        """
        Delete a record.

        :param db: The database session
        :param id: The record id

        :return: The deleted record
        """

        obj = db.query(self.model).get(id)
        db.delete(obj)
        db.commit()
        return obj
