from dataclasses import dataclass, field
from app.schemas import AccountFilter
from app.models import Account
from app.repositories import AccountRepository, TransactionRepository
from app.errors import NotFoundError, DomainError, ForbiddenError


@dataclass
class AccountService:
    account_repository: AccountRepository = field(
        default_factory=lambda: AccountRepository()
    )
    transaction_repository: TransactionRepository = field(
        default_factory=lambda: TransactionRepository()
    )

    def get_all(self, filter: AccountFilter, account_id: int) -> list[Account]:
        accounts = self.account_repository.get_all(filter, account_id)
        return accounts

    def get_account_resume(self, account_id: int):
        this_year_transactions_resume: list[dict] = []
        data = self.transaction_repository.get_this_year_transactions(account_id)
        month_map = {
            1: "Jan",
            2: "Fev",
            3: "Mar",
            4: "Abr",
            5: "Mai",
            6: "Jun",
            7: "Jul",
            8: "Ago",
            9: "Set",
            10: "Out",
            11: "Nov",
            12: "Dez",
        }

        for _, value in month_map.items():
            this_year_transactions_resume.append({"month": value, "label": "Entrada"})
            this_year_transactions_resume.append({"month": value, "label": "Saída"})

        for resume in data:
            for month_resume in this_year_transactions_resume:
                if month_map.get(resume.get("month")) == month_resume.get(
                    "month"
                ) and resume.get("label") == month_resume.get("label"):
                    month_resume["amount"] = resume.get("amount")
                elif month_resume.get("amount") is None:
                    month_resume["amount"] = 0

        return this_year_transactions_resume

    def get_by_id(self, account_id: int) -> Account:
        account: Account = self.account_repository.get_by_id(account_id)

        if account is None:
            raise NotFoundError("Conta não encontrada.")

        return account

    def create(self, account: Account) -> Account:
        account_in_db: Account | None = self.account_repository.get_by_cpf(
            account.person.cpf
        )

        if account_in_db is not None:
            raise DomainError(f"Esse CPF já tem uma conta cadastrada.")

        account.user.generate_password_hash()

        return self.account_repository.save(account)

    def deactivate(self, account_id: int, user_id: int) -> None:
        account: Account = self.account_repository.get_by_id(account_id)

        if account.user_id != user_id:
            raise ForbiddenError("Você não tem permissão para bloquear essa conta.")

        account.fl_active = False
        self.account_repository.save(account)
