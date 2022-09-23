FROM python:3.10.7

WORKDIR /code

COPY ./backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY ./backend/app ./app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]