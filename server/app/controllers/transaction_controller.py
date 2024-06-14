from apiflask import APIBlueprint
from app.security import auth
from app.models import Account
from app.schemas import TransactionIn, TransactionOut, TransactionTransfer
from app.services import TransactionService


transaction_bp = APIBlueprint("Transaction", __name__, url_prefix="/transaction")


@transaction_bp.get("/")
@transaction_bp.auth_required(auth)
@transaction_bp.output(TransactionOut(many=True))
def get_all_transactions(
    transaction_service: TransactionService = TransactionService(),
):
    current_account: Account = auth.current_user.account
    transactions = transaction_service.get_all(current_account.id)
    return [transaction.to_json() for transaction in transactions]


@transaction_bp.get("/<int:id>")
@transaction_bp.auth_required(auth)
def detail_transaction(
    id: int, transaction_service: TransactionService = TransactionService()
):
    transaction = transaction_service.get_by_id(id)
    return transaction.to_json()


@transaction_bp.post("/withdraw")
@transaction_bp.input(TransactionIn, arg_name="transaction_data")
@transaction_bp.auth_required(auth)
def withdraw_money(
    transaction_data: dict,
    transaction_service: TransactionService = TransactionService(),
):
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
    current_account: Account = auth.current_user.account
    transaction_service.transfer(
        current_account.id,
        transaction_data.get("accountId"),
        transaction_data.get("money"),
    )
    return {"message": "Transferência realizada com sucesso."}
