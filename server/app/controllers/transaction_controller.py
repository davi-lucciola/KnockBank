from apiflask import APIBlueprint
from app.security import auth
from app.models import Transaction, Account, User
from app.schemas import (
    TransactionIn,
    TransactionQuery,
    TransactionTransfer,
    TransactionMonthResume,
    PaginationResponse,
)
from app.services import TransactionService


transaction_bp = APIBlueprint("Transaction", __name__, url_prefix="/transaction")


@transaction_bp.get("/")
@transaction_bp.auth_required(auth)
@transaction_bp.input(TransactionQuery, location="query", arg_name="transaction_query")
@transaction_bp.output(PaginationResponse)
def get_all_transactions(
    transaction_query: dict,
    transaction_service: TransactionService = TransactionService(),
):
    """
    Endpoint para buscar transações realizadas pelo usuário.\n
    Trás as transações de forma paginada.
    """
    current_account: Account = auth.current_user.account

    transactions_pagination = transaction_service.get_all(
        transaction_query, current_account.id
    )

    transactions: list[Transaction] = transactions_pagination.get("data")
    transactions_pagination.update(
        {"data": [transaction.to_json() for transaction in transactions]}
    )

    return transactions_pagination


@transaction_bp.get("/resume")
@transaction_bp.auth_required(auth)
@transaction_bp.output(TransactionMonthResume(many=True))
def get_transactions_resume(
    transaction_service: TransactionService = TransactionService(),
):
    """Endpoint para buscar resumo de transações realizadas no ano."""
    current_user: User = auth.current_user

    transactions_resume = transaction_service.get_transactions_resume(
        current_user.account.id
    )

    return transactions_resume


@transaction_bp.get("/<int:id>")
@transaction_bp.auth_required(auth)
def detail_transaction(
    id: int, transaction_service: TransactionService = TransactionService()
):
    """Endpoint para detalhar uma determinada transação."""
    transaction = transaction_service.get_by_id(id)
    return transaction.to_json()


@transaction_bp.post("/withdraw")
@transaction_bp.input(TransactionIn, arg_name="transaction_data")
@transaction_bp.auth_required(auth)
def withdraw_money(
    transaction_data: dict,
    transaction_service: TransactionService = TransactionService(),
):
    """Endpoint para realizar um saque da conta logada."""
    current_account: Account = auth.current_user.account

    new_transaction = transaction_service.withdraw(
        current_account.id, transaction_data.get("money")
    )

    return {
        "message": "Saque realizado com sucesso.",
        "detail": {"created_id": new_transaction.id},
    }


@transaction_bp.post("/deposit")
@transaction_bp.input(TransactionIn, arg_name="transaction_data")
@transaction_bp.auth_required(auth)
def deposit_money(
    transaction_data: dict,
    transaction_service: TransactionService = TransactionService(),
):
    """Endpoint para realizar um depósito na conta logada."""
    current_account: Account = auth.current_user.account

    new_transaction = transaction_service.deposit(
        current_account.id, transaction_data.get("money")
    )

    return {
        "message": "Deposito realizado com sucesso.",
        "detail": {"created_id": new_transaction.id},
    }


@transaction_bp.post("/transfer")
@transaction_bp.input(TransactionTransfer, arg_name="transaction_data")
@transaction_bp.auth_required(auth)
def transfer_money(
    transaction_data: dict,
    transaction_service: TransactionService = TransactionService(),
):
    """Endpoint para realizar uma transferencia para outra conta registrada."""
    current_account: Account = auth.current_user.account

    transaction_service.transfer(
        current_account.id,
        transaction_data.get("accountId"),
        transaction_data.get("money"),
    )

    return {"message": "Transferência realizada com sucesso."}
