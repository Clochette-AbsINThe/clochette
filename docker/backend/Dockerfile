FROM python:3.11

WORKDIR /code

COPY ./backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY ./backend/app ./app
COPY ./backend/alembic.ini ./alembic.ini
COPY ./backend/alembic ./alembic

# run migrations
#RUN alembic revision --autogenerate -m 'Create structure'
#RUN alembic upgrade head

#CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]