from http import HTTPStatus
from flask.testing import FlaskClient
from tests.mocks import create_account_dto
from knockbankapi.infra.repositories import AccountRepository


# ------------ Get My Account Test ---------------
def test_get_my_account_unauthorized(client: FlaskClient):
    response = client.get("/account/me")

    assert response.status_code == HTTPStatus.UNAUTHORIZED
    assert response.json is not None

    json: dict = response.json
    assert json.get("message") is not None
    assert json.get("message") == "É obrigatório estar autenticado."


def test_get_my_account_successfully(client: FlaskClient, authorization: dict):
    response = client.get("/account/me", headers=authorization)

    assert response.status_code == HTTPStatus.OK
    assert response.json is not None

    json: dict = response.json
    assert json.get("id") is not None
    assert json.get("accountType") is not None
    assert json.get("flActive") is not None
    assert json.get("dailyWithdrawLimit") is not None
    assert json.get("person") is not None
    assert json.get("person").get("id") is not None
    assert json.get("person").get("name") is not None
    assert json.get("person").get("cpf") is not None
    assert json.get("person").get("birthDate") is not None


# ------------ Get Other Accounts Test ---------------
def test_get_other_accounts_unauthorized(client: FlaskClient):
    response = client.get("/account")

    assert response.status_code == HTTPStatus.UNAUTHORIZED
    assert response.json is not None

    json: dict = response.json
    assert json.get("message") is not None
    assert json.get("message") == "É obrigatório estar autenticado."


def test_get_other_accounts(client: FlaskClient, authorization: dict):
    response = client.get("/account", headers=authorization)

    assert response.status_code == HTTPStatus.OK
    assert response.json is not None

    json: dict = response.json
    assert json.get("pageIndex") is not None
    assert json.get("pageSize") is not None
    assert json.get("total") is not None
    assert json.get("totalPages") is not None

    data: list[dict] = json.get("data")
    assert data is not None
    assert isinstance(data, list)
    assert len(data) != 0

    assert data[0].get("id") is not None
    assert data[0].get("accountType") is None
    assert data[0].get("flActive") is not None
    assert data[0].get("dailyWithdrawLimit") is None
    assert data[0].get("person") is not None
    assert data[0].get("person").get("id") is not None
    assert data[0].get("person").get("name") is not None
    assert data[0].get("person").get("cpf") is not None
    assert data[0].get("person").get("cpf") == "***.628.130-**"
    assert data[0].get("person").get("birthDate") is None


# ------------ Create Account Tests --------------
# Schema Validation Tests
def test_create_account_missing_values(client: FlaskClient):
    data = {}
    response = client.post("/account", json=data)

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY
    assert response.json is not None

    json: dict = response.json

    assert json.get("message") == "Validation error"
    assert json.get("detail") is not None
    assert json.get("detail") != {}

    errors: dict = json.get("detail").get("json")
    assert errors.get("cpf")[0] == "Missing data for required field."
    assert errors.get("accountType")[0] == "Missing data for required field."
    assert errors.get("birthDate")[0] == "Missing data for required field."
    assert errors.get("password")[0] == "Missing data for required field."


def test_create_account_invalid_cpf(client: FlaskClient):
    data = create_account_dto()
    data["cpf"] = "58901211078"

    response = client.post("/account", json=data)

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY
    assert response.json is not None

    json: dict = response.json

    assert json.get("message") == "Validation error"
    assert json.get("detail") is not None
    assert json.get("detail") != {}

    errors: dict = json.get("detail").get("json")
    assert errors.get("cpf")[0] == "Cpf inválido."


def test_create_account_invalid_password_lenght(client: FlaskClient):
    data = create_account_dto()
    data["password"] = "tes"
    response = client.post("/account", json=data)

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY
    assert response.json is not None

    json: dict = response.json

    assert json.get("message") == "Validation error"
    assert json.get("detail") is not None
    assert json.get("detail") != {}

    errors: dict = json.get("detail").get("json")
    assert errors.get("password")[0] == "A senha deve conter no minímo 8 caracteres."


def test_create_account_password_with_no_lowercase(client: FlaskClient):
    data = create_account_dto()
    data["password"] = "TESTE#123"
    response = client.post("/account", json=data)

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY
    assert response.json is not None

    json: dict = response.json

    assert json.get("message") == "Validation error"
    assert json.get("detail") is not None
    assert json.get("detail") != {}

    errors: dict = json.get("detail").get("json")
    assert errors.get("password")[0] == "A senha deve conter letras minúsculas."


def test_create_account_password_with_no_uppercase(client: FlaskClient):
    data = create_account_dto()
    data["password"] = "teste#123"
    response = client.post("/account", json=data)

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY
    assert response.json is not None

    json: dict = response.json

    assert json.get("message") == "Validation error"
    assert json.get("detail") is not None
    assert json.get("detail") != {}

    errors: dict = json.get("detail").get("json")
    assert errors.get("password")[0] == "A senha deve conter letras maiúsculas."


def test_create_account_password_with_no_numbers(client: FlaskClient):
    data = create_account_dto()
    data["password"] = "teste#ASD"
    response = client.post("/account", json=data)

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY
    assert response.json is not None

    json: dict = response.json

    assert json.get("message") == "Validation error"
    assert json.get("detail") is not None
    assert json.get("detail") != {}

    errors: dict = json.get("detail").get("json")
    assert errors.get("password")[0] == "A senha deve conter numeros."


def test_create_account_password_with_special_characters(client: FlaskClient):
    data = create_account_dto()
    data["password"] = "Teste1234"
    response = client.post("/account", json=data)

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY
    assert response.json is not None

    json: dict = response.json

    assert json.get("message") == "Validation error"
    assert json.get("detail") is not None
    assert json.get("detail") != {}

    errors: dict = json.get("detail").get("json")
    assert errors.get("password")[0] == "A senha deve conter caracteres especiais."


# Bussiness Rules
def test_create_account_cpf_already_exists(client: FlaskClient):
    data = create_account_dto()
    data["cpf"] = "58228952040"  # Tester1 CPF
    response = client.post("/account", json=data)

    assert response.status_code == HTTPStatus.BAD_REQUEST
    assert response.json is not None

    json: dict = response.json

    assert json.get("message") == "Esse CPF já tem uma conta cadastrada."


def test_create_account_successfully(
    client: FlaskClient, account_repository: AccountRepository
):
    data = create_account_dto()

    response = client.post("/account", json=data)

    assert response.status_code == HTTPStatus.CREATED
    assert response.json.get("message") == "Conta cadastrada com sucesso."

    with client.application.app_context():
        account = account_repository.get_by_cpf(data["cpf"])

        assert account is not None
        assert account.person.name == data["name"]
        assert account.person.cpf == data["cpf"]
        assert account.user.verify_password_hash(data["password"]) is True
