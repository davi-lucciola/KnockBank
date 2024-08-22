# Build Stage
FROM python:3.11-alpine as builder

RUN apk update && \
    pip install --upgrade pip && \
    pip install --no-cache-dir poetry

ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache

WORKDIR /knockbank_api

COPY pyproject.toml poetry.lock /knockbank_api/

RUN --mount=type=cache,target=$POETRY_CACHE_DIR poetry install --without dev --no-root

# Runtime Stage
FROM python:3.11-alpine as runtime

ENV VIRTUAL_ENV=/knockbank_api/.venv \
    PATH="/knockbank_api/.venv/bin:$PATH"

COPY --from=builder ${VIRTUAL_ENV} ${VIRTUAL_ENV}

RUN apk update && \
    pip install gunicorn

WORKDIR /knockbank_api

COPY pyproject.toml /knockbank_api
COPY knockbankapi /knockbank_api/knockbankapi/
COPY migrations /knockbank_api/migrations/

EXPOSE 5000

CMD flask --app knockbankapi db upgrade ; gunicorn -b 0.0.0.0:5000 'knockbankapi:create_app()'
