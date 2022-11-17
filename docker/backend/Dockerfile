FROM python:3.11

WORKDIR /code

COPY ./backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY ./backend/app ./app
COPY ./backend/alembic.ini ./alembic.ini
COPY ./backend/alembic ./alembic