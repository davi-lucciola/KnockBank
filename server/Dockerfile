FROM python:3.11-alpine

WORKDIR /knock-bank-api

COPY pyproject.toml poetry.lock /knock-bank-api/

RUN apk update && \
    pip install --upgrade pip && \
    pip install --no-cache-dir poetry && \
    poetry config virtualenvs.create false && \
    poetry install && \
    poetry add gunicorn

COPY . /knock-bank-api/

EXPOSE 5000

CMD ["gunicorn", "-b", "0.0.0.0:5000", "knockbankapi:create_app()"]