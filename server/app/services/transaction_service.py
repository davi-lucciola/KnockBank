from dataclasses import dataclass, field
from datetime import date
from decimal import Decimal
from functools import reduce
from app.errors import NotFoundError, DomainError
from app.models import Account, Transaction, TransactionType
from app.repositories import AccountRepository, TransactionRepository
from app.schemas import TTransactionQuery


@dataclass
class TransactionService:
    account_repository: AccountRepository = field(
        default_factory=lambda: AccountRepository()
    )
    transaction_repository: TransactionRepository = field(
        default_factory=lambda: TransactionRepository()
    )

    def get_all(self, filter: TTransactionQuery, account_id: int):
        transactions_pagination = self.transaction_repository.get_all(
            filter, account_id
        )
        return transactions_pagination

    def get_transactions_resume(self, account_id: int):
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

    def get_by_id(self, transaction_id: int) -> Transaction:
        transaction = self.transaction_repository.get_by_id(transaction_id)

        if transaction is None:
            raise NotFoundError("Transação não Encontrada")

        return transaction

    def withdraw(self, account_id: int, money: float) -> Transaction:
        account: Account = self.account_repository.get_by_id(account_id)

        money: Decimal = Decimal(money)
        if account.balance - money < 0:
            raise DomainError("Não é possivel sacar mais do que há na conta.")

        self.validate_daily_withdraw_limit(account, money)
        account.balance -= money

        transaction = Transaction(-money, TransactionType.WITHDRAW, account)
        return self.transaction_repository.save(transaction)

    def deposit(self, account_id: int, money: float) -> Transaction:
        account: Account = self.account_repository.get_by_id(account_id)

        money: Decimal = Decimal(money)
        account.balance += money

        transaction = Transaction(money, TransactionType.DEPOSIT, account)
        return self.transaction_repository.save(transaction)

    def transfer(
        self, account_sender_id: int, account_reciver_id: int, money: float
    ) -> None:
        account_reciver: Account = self.account_repository.get_by_id(account_reciver_id)

        if account_reciver is None:
            raise NotFoundError("Conta destino não encontrada.")

        account_sender: Account = self.account_repository.get_by_id(account_sender_id)

        money: Decimal = Decimal(money)
        if account_sender.balance - money < 0:
            raise DomainError("Não é possivel transferir mais do que há na conta.")

        self.validate_daily_withdraw_limit(account_sender, money)

        account_sender.balance -= money
        account_reciver.balance += money

        withdraw_transaction = Transaction(
            -money, TransactionType.WITHDRAW, account_sender, account_reciver
        )

        deposit_transaction = Transaction(
            money, TransactionType.DEPOSIT, account_reciver, account_sender
        )

        self.transaction_repository.save_all(
            [withdraw_transaction, deposit_transaction]
        )

    def validate_daily_withdraw_limit(self, account: Account, new_amount: Decimal):
        total = self.transaction_repository.get_total_today_withdraw(account.id)

        if -total + new_amount > account.daily_withdrawal_limit:
            raise DomainError("Limite de saque diário excedido.")
