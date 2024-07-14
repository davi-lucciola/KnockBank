from http import HTTPStatus
from flask.testing import FlaskClient
from knockbankapi.domain.dto import UserLoginDTO
from knockbankapi.infra.utils import JwtService
from knockbankapi.infra.repositories import AccountRepository


# ------------ Login User Tests --------------
def test_login_invalid_credentials_wrong_password(client: FlaskClient):
    user_payload = UserLoginDTO(cpf="58228952040", password="Test#12")
    response = client.post("/login", json=user_payload)

    assert response.status_code == HTTPStatus.FORBIDDEN
    assert response.json is not None
    assert response.json.get("message") == "Credenciais Inválidas."


def test_login_invalid_inexistent_user(client: FlaskClient):
    user_payload = UserLoginDTO(cpf="58228958676", password="qualquer")
    response = client.post("/login", json=user_payload)

    assert response.status_code == HTTPStatus.FORBIDDEN
    assert response.json is not None
    assert response.json.get("message") == "Credenciais Inválidas."


def test_login_successfully(client: FlaskClient, account_repository: AccountRepository):
    user_payload = UserLoginDTO(cpf="58228952040", password="Test#123")
    response = client.post("/login", json=user_payload)

    assert response.status_code == HTTPStatus.OK
    assert response.json is not None
    assert response.json.get("type") == "bearer"

    token = response.json.get("accessToken")
    assert token is not None

    jwt_service = JwtService()
    payload = jwt_service.decode_token(token)

    assert payload.get("user_id") == 1

    with client.application.app_context():
        account = account_repository.get_by_cpf(user_payload["cpf"])
        assert account.user.token == token


# ------------ Logout User Tests --------------
def test_logout_unauthorized(client: FlaskClient):
    response = client.delete("/logout")

    assert response.status_code == HTTPStatus.UNAUTHORIZED
    assert response.json is not None

    json: dict = response.json
    assert json.get("message") is not None
    assert json.get("message") == "É obrigatório estar autenticado."


def test_logout_successfully(client: FlaskClient, authorization: dict, account_repository: AccountRepository):
    response = client.delete("/logout", headers=authorization)

    assert response.status_code == HTTPStatus.OK
    assert response.json is not None

    json: dict = response.json
    assert json.get("message") is not None
    assert json.get("message") == "Conta desconectada com sucesso."

    with client.application.app_context():
        account = account_repository.get_by_id(1)
        assert account.user.token is None
        assert account.user.refresh_token is None
