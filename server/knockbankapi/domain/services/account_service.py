from datetime import date
from dataclasses import dataclass, field
from knockbankapi.domain.models import Account
from knockbankapi.domain.dto import AccountQueryDTO, CreateAccountDTO, UpdateAccountDTO
from knockbankapi.domain.errors import NotFoundError, DomainError, ForbiddenError
from knockbankapi.infra.repositories import AccountRepository, TransactionRepository


@dataclass
class AccountService:
    account_repository: AccountRepository = field(
        default_factory=lambda: AccountRepository()
    )
    transaction_repository: TransactionRepository = field(
        default_factory=lambda: TransactionRepository()
    )

    def get_all(self, filter: AccountQueryDTO, account_id: int):
        accounts_pagination = self.account_repository.get_all(filter, account_id)
        return accounts_pagination

    def get_by_id(self, account_id: int):
        account = self.account_repository.get_by_id(account_id)

        if account is None:
            raise NotFoundError("Conta não encontrada.")

        return account

    def create(self, create_account_dto: CreateAccountDTO):
        person_age = (date.today() - create_account_dto["birthDate"]).days // 365

        if person_age < 18:
            raise DomainError("Você precisa ser maior de idade para criar uma conta.")

        account: Account | None = self.account_repository.get_by_cpf(
            create_account_dto["cpf"]
        )

        if account is not None:
            raise DomainError(f"Esse CPF já tem uma conta cadastrada.")

        account = Account(**create_account_dto)
        account.user.generate_password_hash()

        return self.account_repository.save(account)

    def update(
        self, account_id: int, updated_account_dto: UpdateAccountDTO, user_id: int
    ):
        account: Account = self.get_by_id(account_id)

        if account.user_id != user_id:
            raise ForbiddenError("Você não tem permissão para editar essa conta.")

        today_total_withdraw = float(
            -self.transaction_repository.get_total_today_withdraw(account.id)
        )

        if updated_account_dto["dailyWithdrawLimit"] < float(today_total_withdraw):
            raise DomainError(
                "Você não pode alterar o limite de saque diário para um menor do que já foi sacado hoje."
            )

        account.update(updated_account_dto)
        return self.account_repository.save(account)

    def activate(self, account_id: int):
        account: Account = self.account_repository.get_by_id(account_id)

        account.fl_active = True
        self.account_repository.save(account)

    def deactivate(self, account_id: int, user_id: int):
        account: Account = self.account_repository.get_by_id(account_id)

        if account.user_id != user_id:
            raise ForbiddenError("Você não tem permissão para bloquear essa conta.")

        account.fl_active = False
        self.account_repository.save(account)
