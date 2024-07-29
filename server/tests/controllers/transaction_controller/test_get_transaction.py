from http import HTTPStatus
from flask.testing import FlaskClient
from knockbankapi.domain.models import Transaction, TransactionType
from knockbankapi.infra.repositories import AccountRepository, TransactionRepository


# ------------ Get Transactions Tests --------------
def test_get_my_transactions_unauthorized(client: FlaskClient):
    # Test
    response = client.get("/api/transaction")

    # Assertion
    assert response.status_code == HTTPStatus.UNAUTHORIZED
    assert response.json is not None

    json: dict = response.json
    assert json.get("message") is not None
    assert json.get("message") == "É obrigatório estar autenticado."


def test_get_my_transactions(
    client: FlaskClient,
    authorization: dict,
    account_repository: AccountRepository,
    transaction_repository: TransactionRepository,
):
    # Setup
    account_id = 1
    origin_account_id = 2
    with client.application.app_context():
        account = account_repository.get_by_id(account_id)
        account_reciver = account_repository.get_by_id(origin_account_id)

        transaction1 = Transaction(
            money=-200, transaction_type=TransactionType.WITHDRAW, account=account
        )
        transaction_repository.save(transaction1)

        transaction2 = Transaction(
            money=156.04,
            transaction_type=TransactionType.DEPOSIT,
            account=account,
            origin_account=account_reciver,
        )
        transaction_repository.save(transaction2)

    # Test
    response = client.get("/api/transaction", headers=authorization)

    # Assertion
    assert response.status_code == HTTPStatus.OK

    json: dict = response.json
    assert json.get("pageIndex") is not None
    assert json.get("pageSize") is not None
    assert json.get("total") is not None
    assert json.get("totalPages") is not None

    data: list[dict] = json.get("data")
    assert data is not None
    assert isinstance(data, list)
    assert len(data) != 0

    # Last transctions saved must be the first
    assert data[0].get("id") is not None
    assert data[0].get("money") is not None
    assert data[0].get("money") == 156.04
    assert data[0].get("dateTime") is not None
    assert data[0].get("transactionType") is not None
    assert data[0].get("transactionType") == TransactionType.DEPOSIT.value[0]
    assert data[0].get("account") is not None
    assert data[0].get("account").get("id") == account_id
    assert data[0].get("originAccount") is not None
    assert data[0].get("originAccount").get("id") == origin_account_id

    assert data[1].get("id") is not None
    assert data[1].get("money") is not None
    assert data[1].get("money") == -200
    assert data[1].get("dateTime") is not None
    assert data[1].get("transactionType") is not None
    assert data[1].get("transactionType") == TransactionType.WITHDRAW.value[0]
    assert data[1].get("account") is not None
    assert data[1].get("account").get("id") == account_id
    assert data[1].get("originAccount") is None
