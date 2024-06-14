from http import HTTPStatus
from apiflask import APIBlueprint
from app.schemas import (
    Response,
    AccountIn,
    AccountOut,
    AccountFilter,
    AccountQuery,
    AccountMe,
)
from app.security import auth
from app.services import AccountService
from app.models import Account, User


account_bp = APIBlueprint("Account", __name__, url_prefix="/account")


@account_bp.get("/me")
@account_bp.auth_required(auth)
@account_bp.output(AccountMe)
def get_auth_account():
    """Endpoint para buscar os dados da conta logada."""
    account: Account = auth.current_user.account
    return account.to_json()


@account_bp.get("/")
@account_bp.auth_required(auth)
@account_bp.input(AccountQuery, location="query", arg_name="account_query")
@account_bp.output(AccountOut(many=True))
def get_all(
    account_query: AccountFilter, account_service: AccountService = AccountService()
):
    """Endpoint para buscar contas cadastradas,"""
    current_user: User = auth.current_user
    accounts = account_service.get_all(account_query, current_user.account.id)
    return [account.to_json() for account in accounts]


@account_bp.post("/")
@account_bp.input(AccountIn, arg_name="account_in")
@account_bp.output(Response, status_code=HTTPStatus.CREATED)
def create_account(
    account_in: dict, account_service: AccountService = AccountService()
):
    """Endpoint para cadastrar uma conta."""
    account: Account = account_service.create(Account(**account_in))
    return {
        "message": "Conta cadastrada com sucesso.",
        "detail": {"created_id": account.id},
    }


@account_bp.delete("/<int:id>")
@account_bp.auth_required(auth)
def deactivate_account(id: int, account_service: AccountService = AccountService()):
    """
    Endpoint para desativar uma conta.\n
    Somente o dono da conta pode desativar.\n
    """
    user: User = auth.current_user
    account_service.deactivate(id, user.id)
    return {
        "message": "Conta bloqueada com sucesso.",
    }
