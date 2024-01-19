# Application Architecture Documentation

## Overview

This documentation provides an overview of the architecture of the application. The application is structured using a modular approach, dividing its components into several packages and modules to promote reusability and maintainability. The primary components of the application are as follows:

1. `alembic`: This directory contains files related to database migrations using Alembic.

2. `app`: This is the main application package that contains the core functionality of the application. It is further divided into several sub-packages and modules as described below.

## App Package Structure

### 1. `api` Package

The `api` package contains the API-related functionality of the application. It is divided into three sub-packages: `utils`, `v1` and `v2`.

#### `utils` Sub-package

The `utils` sub-package contains utility API endpoints. The file `endpoints.py` within this package holds utility API endpoints.

The endpoints are as follows:

- `/health`: Returns the health status of the application.
- `/version`: Returns the version of the application.

#### `v1` Sub-package

The `v1` sub-package represents the version 1 of the API. It contains API route handlers for various resources like accounts, barrels, consumables, drinks, glasses, out-of-stock items, transactions, and treasuries. Each resource has its own module containing API route handlers.

#### `v2` Sub-package

The `v2` sub-package represents the version 2 of the API. It contains API route handlers for various resources like barrels, consumables, glasses, non inventoried items, transactions. Each resource has its own module containing API route handlers.

### 2. `commands` Package

The `commands` package contains custom CLI commands used in the application. Each command has its own module. The available commands are `init_db`, `migrate_db`, `open_api`, and `reset_db`.

### 3. `core` Package

The `core` package contains core functionality used throughout the application. It includes modules related to authentication, configuration, decorators, middleware, security, translation, custom types, and utility functions.

The `misc` module contains miscellaneous functionality used throughout the application. It includes the following:

- `to_query_parameters`: Converts a Pydantic model to another Pydantic model that can be used as query parameters in API endpoints.

The `alert_backend` module contains the logging of errors and creation of alerts.

### 4. `crud` Package

The `crud` package contains CRUD (Create, Read, Update, Delete) operations for various database models. Each model has its own module for CRUD operations. The available models are accounts, barrels, consumables, drinks, glasses, out-of-stock items, transactions, and treasuries.

### 5. `db` Package

The `db` package handles database-related functionality, including database initialization, database connection, and model declaration. It contains modules related to the database interface, database selection, and pre-start configuration.

### 6. `models` Package

The `models` package defines the SQLAlchemy models used to interact with the database. Each model has its own module.

### 7. `plugins` Package

The `plugins` package contains custom plugins used in the application. The available plugin is `postgresql_enum`, which deals with PostgreSQL-specific enumeration types, used by alembic for database migrations.

### 8. `schemas` Package

The `schemas` package contains Pydantic schemas used for data validation and serialization. Each model in the application has a corresponding schema defined in its own module.

### 9. `utils` Package

The `utils` package contains general utility functions used throughout the application. It includes modules related to version retrieval, submodule loading, and logging.

## Key Technologies Used

The application utilizes the following technologies and frameworks:

- SQLAlchemy: An ORM (Object-Relational Mapping) library for database interaction.
- Alembic: A database migration tool.
- FastAPI: A modern web framework for building APIs with Python.
- Pydantic: A data validation and serialization library for Python.
- PostgreSQL: A powerful relational database used as the backend database.
