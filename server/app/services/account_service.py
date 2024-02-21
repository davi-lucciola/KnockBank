from dataclasses import dataclass, field
from app.errors import NotFoundError, DomainError
from app.models import Account
from app.repositories import AccountRepository
from app.errors.forbidden_error import ForbiddenError


@dataclass
class AccountService:
    account_repository: AccountRepository = field(
        default_factory=lambda: AccountRepository()
    )

    def get_by_id(self, account_id: int) -> Account:
        account: Account = self.account_repository.get_by_id(account_id)

        if account is None:
            raise NotFoundError("Conta não encontrada.")

        return account

    def create(self, account: Account) -> Account:
        account_in_db: Account = self.account_repository.get_by_cpf(account.person.cpf)

        if account_in_db is not None:
            raise DomainError(f"Esse CPF já tem uma conta cadastrada.")

        account.user.generate_password_hash()

        return self.account_repository.save(account)

    def deactivate(self, account_id: int, user_id: int) -> None:
        account: Account = self.account_repository.get_by_id(account_id)

        if account.user_id != user_id:
            raise ForbiddenError("Você não tem permissão para bloquear essa Account.")

        account.fl_active = False
        self.account_repository.save(account)
