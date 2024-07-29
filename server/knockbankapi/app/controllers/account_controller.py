from http import HTTPStatus
from apiflask import APIBlueprint
from knockbankapi.app.auth import auth
from knockbankapi.app.schemas import (
    Response,
    AccountIn,
    AccountQuery,
    AccountMe,
    BaseAccount,
    PaginationAccountOut,
)
from knockbankapi.domain.dto import AccountQueryDTO, CreateAccountDTO, UpdateAccountDTO
from knockbankapi.domain.models import Account, User
from knockbankapi.domain.services import AccountService
from knockbankapi.infra.repositories import TransactionRepository


account_bp = APIBlueprint("Account", __name__, url_prefix="/api/account")


@account_bp.get("/me")
@account_bp.auth_required(auth)
@account_bp.output(AccountMe)
def get_auth_account(
    transaction_repository: TransactionRepository = TransactionRepository(),
):
    """Endpoint para buscar os dados da conta logada."""
    account: Account = auth.current_user.account
    today_withdraw = transaction_repository.get_total_today_withdraw(account.id)

    account_json = account.to_json()
    account_json.update({"todayWithdraw": float(-(today_withdraw))})

    return account_json


@account_bp.get("/")
@account_bp.auth_required(auth)
@account_bp.input(AccountQuery, location="query", arg_name="account_query")
@account_bp.output(PaginationAccountOut)
def get_all(
    account_query: AccountQueryDTO, account_service: AccountService = AccountService()
):
    """
    Endpoint para buscar contas cadastradas.\n
    Não trás a propria conta que está consultando.
    """
    current_user: User = auth.current_user

    accounts_pagination = account_service.get_all(
        account_query, current_user.account.id
    )

    accounts = accounts_pagination["data"]
    accounts_pagination["data"] = [
        account.to_json(mask_cpf=True) for account in accounts
    ]

    return accounts_pagination


@account_bp.post("/")
@account_bp.input(AccountIn, arg_name="create_account_dto")
@account_bp.output(Response, status_code=HTTPStatus.CREATED)
def create_account(
    create_account_dto: CreateAccountDTO,
    account_service: AccountService = AccountService(),
):
    """Endpoint para cadastrar uma nova conta."""
    account = account_service.create(create_account_dto)

    return {
        "message": "Conta cadastrada com sucesso.",
        "detail": {"created_id": account.id},
    }


@account_bp.put("/<int:id>")
@account_bp.auth_required(auth)
@account_bp.input(BaseAccount, arg_name="update_account_dto")
@account_bp.output(Response, status_code=HTTPStatus.CREATED)
def update_account(
    id: int,
    update_account_dto: UpdateAccountDTO,
    account_service: AccountService = AccountService(),
):
    """
    Endpoint para atualizar uma conta.\n
    Algumas informações não podem ser atualizadas, como por exemplo o CPF.\n
    Somente o dono da conta pode atualizar as informações.
    """
    current_user: User = auth.current_user
    account_service.update(id, update_account_dto, current_user.id)

    return {
        "message": "Conta atualizada com sucesso.",
    }


@account_bp.delete("/<int:id>")
@account_bp.auth_required(auth)
def deactivate_account(id: int, account_service: AccountService = AccountService()):
    """
    Endpoint para desativar uma conta.\n
    Somente o dono da conta pode desativar.
    """
    user: User = auth.current_user
    account_service.deactivate(id, user.id)
    return {
        "message": "Conta bloqueada com sucesso.",
    }
