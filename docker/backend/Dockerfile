FROM python:3.11-alpine

WORKDIR /code

COPY ./backend/requirements.txt ./requirements.txt

RUN \
    apk add --no-cache postgresql-libs && \
    apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev && \
    pip install --no-cache-dir --upgrade -r requirements.txt && \
    apk --purge del .build-deps

COPY ./backend/app ./app
COPY ./backend/alembic.ini ./alembic.ini
COPY ./backend/alembic ./alembic

