from apiflask import APIBlueprint
from knockbankapi.app.auth import auth
from knockbankapi.app.schemas import (
    TransactionIn,
    TransactionQuery,
    TransactionTransfer,
    TransactionMonthResume,
    PaginationTransactionOut,
)
from knockbankapi.domain.dto import (
    TransactionQueryDTO,
    TransactionDTO,
    TransactionTransferDTO,
)
from knockbankapi.domain.models import Account
from knockbankapi.domain.services import TransactionService


transaction_bp = APIBlueprint("Transaction", __name__, url_prefix="/api/transaction")


@transaction_bp.get("/")
@transaction_bp.auth_required(auth)
@transaction_bp.input(TransactionQuery, location="query", arg_name="transaction_query")
@transaction_bp.output(PaginationTransactionOut)
def get_all_transactions(
    transaction_query: TransactionQueryDTO,
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

    transactions = transactions_pagination["data"]
    transactions_pagination["data"] = [
        transaction.to_json() for transaction in transactions
    ]

    return transactions_pagination


@transaction_bp.get("/resume")
@transaction_bp.auth_required(auth)
@transaction_bp.output(TransactionMonthResume(many=True))
def get_transactions_resume(
    transaction_service: TransactionService = TransactionService(),
):
    """Endpoint para buscar resumo de transações realizadas no ano."""
    account: Account = auth.current_user.account

    transactions_resume = transaction_service.get_transactions_resume(account.id)

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
@transaction_bp.auth_required(auth)
@transaction_bp.input(TransactionIn, arg_name="transaction_dto")
def withdraw_money(
    transaction_dto: TransactionDTO,
    transaction_service: TransactionService = TransactionService(),
):
    """Endpoint para realizar um saque da conta logada."""
    transaction_dto["accountId"] = auth.current_user.account.id

    transaction_service.withdraw(transaction_dto)
    return {"message": "Saque realizado com sucesso."}


@transaction_bp.post("/deposit")
@transaction_bp.input(TransactionIn, arg_name="transaction_dto")
@transaction_bp.auth_required(auth)
def deposit_money(
    transaction_dto: TransactionDTO,
    transaction_service: TransactionService = TransactionService(),
):
    """Endpoint para realizar um depósito na conta logada."""
    transaction_dto["accountId"] = auth.current_user.account.id

    transaction_service.deposit(transaction_dto)
    return {
        "message": "Deposito realizado com sucesso.",
    }


@transaction_bp.post("/transfer")
@transaction_bp.auth_required(auth)
@transaction_bp.input(TransactionTransfer, arg_name="transaction_transfer_dto")
def transfer_money(
    transaction_transfer_dto: TransactionTransferDTO,
    transaction_service: TransactionService = TransactionService(),
):
    """Endpoint para realizar uma transferencia para outra conta registrada."""
    transaction_transfer_dto["senderAccountId"] = auth.current_user.account.id

    transaction_service.transfer(transaction_transfer_dto)
    return {"message": "Transferência realizada com sucesso."}
