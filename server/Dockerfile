FROM python:3.10-alpine

WORKDIR /knock-bank-api

COPY pyproject.toml poetry.lock /knock-bank-api/

RUN apk update && \
    pip install --upgrade pip && \
    pip install --no-cache-dir poetry && \
    poetry config virtualenvs.create false && \
    poetry install

COPY . /knock-bank-api/

EXPOSE 5000

CMD ["flask", "run", "--host", "0.0.0.0"]