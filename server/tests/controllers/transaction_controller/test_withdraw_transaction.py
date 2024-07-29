from http import HTTPStatus
from flask.testing import FlaskClient
from tests.mocks import transaction_dto, transaction_query_dto
from knockbankapi.domain.models import TransactionType
from knockbankapi.infra.repositories import AccountRepository, TransactionRepository


# ------------ Withdraw Transactions Tests --------------
def test_withdraw_unauthorized(client: FlaskClient):
    # Test
    data = transaction_dto()
    response = client.post("/api/transaction/withdraw", json=data)

    # Assertion
    assert response.status_code == HTTPStatus.UNAUTHORIZED
    assert response.json is not None

    json: dict = response.json
    assert json.get("message") is not None
    assert json.get("message") == "É obrigatório estar autenticado."


def test_withdraw_required_fields(client: FlaskClient, authorization: dict):
    # Test
    data = {}
    response = client.post("/api/transaction/withdraw", json=data, headers=authorization)

    # Assertion
    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY
    assert response.json is not None

    json: dict = response.json

    assert json.get("message") == "Validation error"
    assert json.get("detail") is not None
    assert json.get("detail") != {}

    errors: dict = json.get("detail").get("json")
    assert errors.get("money")[0] == "Missing data for required field."


def test_withdraw_invalid_money(client: FlaskClient, authorization: dict):
    # Test
    data = transaction_dto()
    data["money"] = -200
    response = client.post("/api/transaction/withdraw", json=data, headers=authorization)

    # Assertion
    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY
    assert response.json is not None

    json: dict = response.json

    assert json.get("message") == "Validation error"
    assert json.get("detail") is not None
    assert json.get("detail") != {}

    errors: dict = json.get("detail").get("json")
    assert errors.get("money")[0] == "O valor da transação deve ser maior que zero."


def test_withdraw_no_available_balance(
    client: FlaskClient, authorization: dict, account_repository: AccountRepository
):
    data = transaction_dto()
    with client.application.app_context():
        account_id = 1
        account = account_repository.get_by_id(account_id)

        assert account.balance < data["money"]

    response = client.post("/api/transaction/withdraw", json=data, headers=authorization)

    assert response.status_code == HTTPStatus.BAD_REQUEST
    assert response.json is not None

    json: dict = response.json
    assert json.get("message") == "Saldo insuficiente."


def test_withdraw_no_daily_limit_available(
    client: FlaskClient,
    authorization: dict,
    account_repository: AccountRepository,
):
    data = transaction_dto()
    data["money"] = 2000
    with client.application.app_context():
        account_id = 1
        account = account_repository.get_by_id(account_id)

        account.balance = 3000
        account = account_repository.save(account)

        assert account.balance > data["money"]
        assert account.daily_withdraw_limit < data["money"]

    response = client.post("/api/transaction/withdraw", json=data, headers=authorization)

    assert response.status_code == HTTPStatus.BAD_REQUEST
    assert response.json is not None

    json: dict = response.json
    assert json.get("message") == "Limite de saque diário excedido."


def test_withdraw_successfully(
    client: FlaskClient,
    authorization: dict,
    account_repository: AccountRepository,
    transaction_repository: TransactionRepository,
):
    data = transaction_dto()
    initial_balance = 800
    with client.application.app_context():
        account_id = 1
        account = account_repository.get_by_id(account_id)

        account.balance = initial_balance
        account = account_repository.save(account)

        assert account.balance >= data["money"]
        assert account.daily_withdraw_limit > data["money"]

    response = client.post("/api/transaction/withdraw", json=data, headers=authorization)

    assert response.status_code == HTTPStatus.OK
    assert response.json is not None

    json: dict = response.json
    assert json.get("message") == "Saque realizado com sucesso."

    with client.application.app_context():
        account = account_repository.get_by_id(account_id)

        assert float(account.balance) == initial_balance - data["money"]
        assert (
            abs(float(transaction_repository.get_total_today_withdraw(account_id)))
            == data["money"]
        )

        filter = transaction_query_dto()
        transactions = transaction_repository.get_all(filter, account_id)
        assert transactions["data"] is not None
        assert len(transactions["data"]) != 0
        assert transactions["data"][0].account_id == account_id
        assert abs(float(transactions["data"][0].money)) == data["money"]
        assert (
            transactions["data"][0].transaction_type
            == TransactionType.WITHDRAW.value[0]
        )
        assert transactions["data"][0].origin_account_id is None
