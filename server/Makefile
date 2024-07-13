run:
	poetry run flask --app knockbankapi run --debug

install:
	poetry install

reinstall: 
	make clean
	rm -rf .venv
	make install

test:
	poetry run pytest

lint:
	poetry run black .

clean: 
	find . -type f -name '*.py[co]' -delete -o -type d -name __pycache__ -delete
	rm -rf .pytest_cache

generate:
	poetry run flask --app knockbankapi db migrate -m "${migration}"

migrate:
	poetry run flask --app knockbankapi db upgrade
