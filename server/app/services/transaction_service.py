from dataclasses import dataclass, field
from decimal import Decimal
from functools import reduce
from app.errors import NotFoundError, DomainError, NoContentError
from app.models import Account, Transaction, TransactionType
from app.repositories import AccountRepository, TransactionRepository


@dataclass
class TransactionService:
    account_repository: AccountRepository = field(
        default_factory=lambda: AccountRepository()
    )
    transaction_repository: TransactionRepository = field(
        default_factory=lambda: TransactionRepository()
    )

    def get_all(self, account_id: int) -> list[Transaction]:
        transactions = self.transaction_repository.get_all(account_id)

        if len(transactions) == 0:
            raise NoContentError()

        return transactions

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

        today_transactions = self.transaction_repository.get_today_transactions(
            account_id
        )
        total_today_transactions = reduce(
            lambda total, tran: total + tran.money, today_transactions, Decimal(0)
        )
        if total_today_transactions + money > account.daily_withdrawal_limit:
            raise DomainError("Limite de saque diário excedido.")

        account.balance -= money

        transaction = Transaction(-money, account, TransactionType.WITHDRAW)
        return self.transaction_repository.save(transaction)

    def deposit(self, account_id: int, money: float):
        account: Account = self.account_repository.get_by_id(account_id)

        money: Decimal = Decimal(money)
        account.balance += money

        transaction = Transaction(money, account, TransactionType.DEPOSIT)
        return self.transaction_repository.save(transaction)

    def transfer(self, account_sender_id: int, account_reciver_id: int, money: float):
        account_reciver: Account = self.account_repository.get_by_id(account_reciver_id)
        if account_reciver is None:
            raise NotFoundError("Conta destino não encontrada.")

        account_sender: Account = self.account_repository.get_by_id(account_sender_id)

        money: Decimal = Decimal(money)
        if account_sender.balance - money < 0:
            raise DomainError("Não é possivel transferir mais do que há na conta.")

        account_sender.balance -= money
        account_reciver.balance += money

        transaction_sender = Transaction(
            -money, account_sender, TransactionType.TRANSFER
        )
        transaction_reciver = Transaction(
            money, account_reciver, TransactionType.TRANSFER
        )

        self.transaction_repository.save_all([transaction_sender, transaction_reciver])
