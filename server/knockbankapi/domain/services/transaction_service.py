from decimal import Decimal
from dataclasses import dataclass, field
from knockbankapi.domain.errors import NotFoundError, DomainError
from knockbankapi.domain.dto import (
    TransactionQueryDTO,
    TransactionDTO,
    TransactionTransferDTO,
)
from knockbankapi.domain.models import Account, Transaction, TransactionType
from knockbankapi.infra.repositories import AccountRepository, TransactionRepository


@dataclass
class TransactionService:
    account_repository: AccountRepository = field(
        default_factory=lambda: AccountRepository()
    )
    transaction_repository: TransactionRepository = field(
        default_factory=lambda: TransactionRepository()
    )

    def get_all(self, filter: TransactionQueryDTO, account_id: int):
        transactions_pagination = self.transaction_repository.get_all(
            filter, account_id
        )
        return transactions_pagination

    def get_transactions_resume(self, account_id: int):
        data = self.transaction_repository.get_this_year_transactions(account_id)
        return data

    def get_by_id(self, transaction_id: int) -> Transaction:
        transaction = self.transaction_repository.get_by_id(transaction_id)

        if transaction is None:
            raise NotFoundError("Transação não Encontrada")

        return transaction

    def withdraw(self, transaction_dto: TransactionDTO):
        account: Account = self.account_repository.get_by_id(
            transaction_dto["accountId"]
        )

        money: Decimal = Decimal(transaction_dto["money"])
        if account.balance - money < 0:
            raise DomainError("Saldo insuficiente.")

        self.validate_daily_withdraw_limit(account, money)
        account.balance -= money

        transaction = Transaction(-money, TransactionType.WITHDRAW, account)
        self.transaction_repository.save(transaction)

    def deposit(self, transaction_dto: TransactionDTO):
        account: Account = self.account_repository.get_by_id(
            transaction_dto["accountId"]
        )

        money: Decimal = Decimal(transaction_dto["money"])
        account.balance += money

        transaction = Transaction(money, TransactionType.DEPOSIT, account)
        self.transaction_repository.save(transaction)

    def transfer(self, transaction_transfer_dto: TransactionTransferDTO):
        if (
            transaction_transfer_dto["accountId"]
            == transaction_transfer_dto["senderAccountId"]
        ):
            raise DomainError(
                "Não é possivel realizar uma trânsferencia para sua propria conta, por favor realize um deposito."
            )

        account_reciver = self.account_repository.get_by_id(
            transaction_transfer_dto["accountId"]
        )

        if account_reciver is None:
            raise NotFoundError("Conta destino não encontrada.")

        account_sender: Account = self.account_repository.get_by_id(
            transaction_transfer_dto["senderAccountId"]
        )

        money: Decimal = Decimal(transaction_transfer_dto["money"])
        if account_sender.balance - money < 0:
            raise DomainError("Saldo insuficiente.")

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

        if round(-total + new_amount, 2) > account.daily_withdraw_limit:
            raise DomainError("Limite de saque diário excedido.")
