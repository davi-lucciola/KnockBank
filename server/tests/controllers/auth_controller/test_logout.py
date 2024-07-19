from http import HTTPStatus
from flask.testing import FlaskClient
from knockbankapi.infra.repositories import AccountRepository


# ------------ Logout User Tests --------------
def test_logout_unauthorized(client: FlaskClient):
    response = client.delete("/logout")

    assert response.status_code == HTTPStatus.UNAUTHORIZED
    assert response.json is not None

    json: dict = response.json
    assert json.get("message") is not None
    assert json.get("message") == "É obrigatório estar autenticado."


def test_logout_successfully(
    client: FlaskClient, authorization: dict, account_repository: AccountRepository
):
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
