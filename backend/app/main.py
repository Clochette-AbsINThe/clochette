import os
import psycopg2
import shlex
import subprocess

from fastapi import APIRouter, FastAPI
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from time import sleep

from app.api.v1.api import api_v1_router
from app.core.config import settings
from app.core.middleware import ExceptionMonitorMiddleware
from app.core.utils.alert_backend import alert_backend
from app.initial_data import init_db


app = FastAPI(
    title="Clochette API",
    openapi_url="{prefix}/openapi.json".format(prefix=settings.API_V1_PREFIX),
)

app.add_middleware(
    ExceptionMonitorMiddleware, alert_backend=alert_backend()
)
app.add_middleware(
    TrustedHostMiddleware, allowed_hosts=settings.ALLOWED_HOSTS
)

api_router = APIRouter(
    prefix=settings.API_V1_PREFIX,
)


@app.on_event("startup")
async def run_migrations():
    # Wait for db to start
    if os.environ.get("MIGRATE") == 'True':
        while True:
            try:
                conn = psycopg2.connect(
                    host=settings.POSTGRES_HOST,
                    port=settings.POSTGRES_PORT,
                    user=settings.POSTGRES_USER,
                    password=settings.POSTGRES_PASSWORD,
                    database='postgres',
                )
                print("Postgres is up -- starting migrations")
                # If some tables with enum type already exists in the database, migrations won't work: https://github.com/sqlalchemy/alembic/issues/278
                # If this bug happen, it is necessary to clean up the database and then run migrations again.
                # So let's clear the db and recreate all tables
                print("Trying to drop {db} database if it exists...".format(db=settings.POSTGRES_DB))
                cur = conn.cursor()
                conn.autocommit = True # CREATE/DROP DATABASE cannot run inside a transaction block because it is irreversible
                cur.execute(
                    "DROP DATABASE IF EXISTS {db};".format(
                        db=settings.POSTGRES_DB
                        
                    )
                )
                print("Database {db} dropped".format(db=settings.POSTGRES_DB))
                print("Trying to create {db} database...".format(db=settings.POSTGRES_DB))
                cur.execute(
                    "CREATE DATABASE {db};".format(
                        db=settings.POSTGRES_DB
                    )
                )
                print("Database {db} created".format(db=settings.POSTGRES_DB))
                conn.close()
                # Run alembic migrations
                print("Running migrations...")
                subprocess.run(
                    shlex.split("alembic stamp head"),
                    check=True
                )
                subprocess.run(
                    shlex.split("alembic revision --autogenerate"),
                    check=True
                )
                subprocess.run(
                    shlex.split("alembic upgrade head"),
                    check=True
                )
            except psycopg2.OperationalError as e:
                if e.pgcode is None or e.pgcode.startswith("08"):
                    print("Postgres is unavailable -- sleeping (receiving error code {code})".format(code=e.pgcode))
                    sleep(1)
                    continue
                else:
                    raise e

            print("Populating database with initial data...")
            init_db()
            print("Database populated.")


@api_router.get("/", status_code=200)
async def root() -> dict:
    return {
        "msg": "Hello, World!",
    }


app.include_router(api_router)
app.include_router(api_v1_router, prefix=settings.API_V1_PREFIX)
