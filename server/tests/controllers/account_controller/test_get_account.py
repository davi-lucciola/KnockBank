from http import HTTPStatus
from flask.testing import FlaskClient


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
