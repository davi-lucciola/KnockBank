import pytest
from http import HTTPStatus
from datetime import date
from flask.testing import FlaskClient
from knockbankapi import APIFlask, create_app
from knockbankapi.domain.dto import UserLoginDTO
from knockbankapi.domain.models import Account
from knockbankapi.infra import Config, db
from knockbankapi.infra.repositories import AccountRepository, TransactionRepository


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"


@pytest.fixture(scope="module")
def app():
    app = create_app(TestingConfig)

    with app.app_context():
        db.create_all()

        account1 = Account(
            name="Tester1",
            cpf="58228952040",
            birthDate=date(1980, 2, 15),
            password="Test#123",
            accountType=1,
        )

        account2 = Account(
            name="Tester2",
            cpf="38162813039",
            birthDate=date(1980, 2, 15),
            password="Test#123",
            accountType=1,
        )

        account1.user.generate_password_hash()
        account2.user.generate_password_hash()

        db.session.add(account1)
        db.session.add(account2)

        db.session.commit()

    yield app

    with app.app_context():
        db.drop_all()


@pytest.fixture(scope="module")
def client(app: APIFlask):
    return app.test_client()


@pytest.fixture(scope="module")
def account_repository():
    return AccountRepository()


@pytest.fixture(scope="module")
def transaction_repository():
    return TransactionRepository()


@pytest.fixture(scope="function")
def authorization(client: FlaskClient):
    data = UserLoginDTO(cpf="58228952040", password="Test#123")

    response = client.post("/api/login", json=data)

    assert response.status_code == HTTPStatus.OK
    assert response.json is not None

    token = response.json.get("accessToken")
    assert token is not None

    headers = {"Authorization": f"Bearer {token}"}
    return headers
