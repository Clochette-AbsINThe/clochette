# Fast API Backend for clochette website

This is the backend for the clochette website. It is based on FastAPI and uses a PostgreSQL database.

You can find more information about the architecture in the [architecture.md](./docs/architecture.md) file.

## Requirements

- Python 3.11
- Poetry

## Installation

### Install dependencies

Poetry will take all the information on the `pyproject.toml` file and will install all its dependencoies.

You can install Poetry using the following command:

**Linux or Mac:**

```bash
$ curl -sSL https://install.python-poetry.org | python3 -
```

**Windows:**

```powershell
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -
```

Source: https://python-poetry.org/docs/#installing-with-the-official-installer

Then, you can install the dependencies.

#### Virtual env if you use Conda

Start the conda env:

```bash
$ conda activate your_env
```

Create a virtual env under the `.venv` folder:

```bash
$ python -m venv .venv
```

Deactivate the conda env:

```bash
$ conda deactivate
```

#### Install the dependencies

```bash
$ poetry install
```

Activate the virtual env:

```bash
$ source .venv/bin/activate
```

#### Install the pre-commit Git hook

```bash
$ pre-commit install
```

## CLI

There is a CLI to manage the database. You can run it with the following command:

```bash
$ python app/command.py -h
```

### Available commands

- `reset`: Reset the database
- `migrate`: Migrate the database
  - `-f`: Force the migration
  - `--bypass-revision`: Bypass the generation of a new revision
- `init`: Initialize the database with the default values (Reset + Migrate + Seed)
  - `-y`: Skip the confirmation
  - `--bypass-revision`: Bypass the generation of a new revision
- `openapi`: Generate the OpenAPI schema
  - `-o`: Output file, default: `openapi.json`
- `dump`: Dump the database
  - `-o`: Output file, default: `dump.json`
- `load`: Load the database
  - `-i`: Input file, default: `dump.json`
- `command`: Run a plain SQL command
  - `"command"`: The SQL command to run

## Tests

### Run the tests

We use `pytest` to run the tests. You can run them with the following command which will run them in parallel:

```bash
$ pytest -n auto
```

You can use a number instead of `auto` to specify the number of workers.

### Run the tests with html report

You can run the tests with an html report with the following command:

```bash
$ pytest -n auto --cov-report html
```

The report will be generated in the `htmlcov` folder.

## Usage

### Run the app

Then, you can run the app with the following command from the root folder:

```bash
$ uvicorn app.main:app --reload
```

### Availabe configuration

You can configure the app using the [config.py](./app/core/config.py) file.

There is 3 different configuration:

- `DevelopmentConfig`: Used for development
- `TestingConfig`: Used for testing
- `ProductionConfig`: Used for production

You can change the configuration by changing the `ENVIRONMENT` variable to be either `development`, `test` or `production`.
By default the `ENVIRONMENT` variable is set to `development`.

You can choose to run on PostgreSQL by setting the `DB_TYPE` environment variable to `POSTGRES`.
By default the `DB_TYPE` variable is set to `SQLITE`.

```bash
$ export DB_TYPE=POSTGRES
```

Here is a command to start a docker container with a PostgreSQL database:

```bash
docker run --name clochette-postgres -e POSTGRES_USER=clochette -e POSTGRES_PASSWORD=clochette -e POSTGRES_DB=clochette -p 127.0.0.1:5432:5432/tcp -d postgres
```

#### Default values for development

- `DATABASE_URI`: `SQLITE_DATABASE_URI`
- `SQLITE_DATABASE_URI`: `sqlite+aiosqlite:///./clochette.db`
- `POSTGRES_DATABASE_URI`: `postgresql+asyncpg://clochette:clochette@localhost:5432/clochette`
- `JWT_SECRET_KEY`: `6a50e3ddeef70fd46da504d8d0a226db7f0b44dcdeb65b97751cf2393b33693e` can be generated with `openssl rand -hex 32` and could be overriden by the `SECRET_KEY` environment variable
- `BASE_ACCOUNT_USERNAME`: `admin`
- `BASE_ACCOUNT_PASSWORD`: `admin-password*45`
