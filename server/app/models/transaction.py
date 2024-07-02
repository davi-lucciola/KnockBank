from enum import Enum
from datetime import datetime as dt
from decimal import Decimal
from sqlalchemy import Integer, BigInteger, DateTime, Numeric, ForeignKey
from sqlalchemy.orm import Mapped, relationship, mapped_column
from app.models import BaseModel, Account


class TransactionType(Enum):
    DEPOSIT = (1, "Depósito")
    WITHDRAW = (2, "Saque")

    @classmethod
    def get_transaction_type(cls, transaction_type_id: int):
        for transaction_type in cls:
            if transaction_type.value[0] == transaction_type_id:
                return transaction_type

        raise ValueError("Tipo de Transação Inválida.")


class Transaction(BaseModel):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    date_time: Mapped[dt] = mapped_column(DateTime, nullable=False, default=dt.now())
    money: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    transaction_type: Mapped[int] = mapped_column(Integer, nullable=False)

    account_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("accounts.id"), nullable=False
    )
    account: Mapped["Account"] = relationship("Account", foreign_keys=[account_id])

    origin_account_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("accounts.id"), nullable=True
    )
    origin_account: Mapped["Account"] = relationship(
        "Account", foreign_keys=[origin_account_id]
    )

    def __init__(
        self,
        money: float,
        transaction_type: TransactionType,
        account: Account,
        origin_account: Account = None,
    ) -> None:
        self.money = Decimal(money)
        self.transaction_type = transaction_type.value[0]
        self.account_id = account.id
        self.account = account
        self.origin_account_id = (
            origin_account.id if origin_account is not None else None
        )
        self.origin_account = origin_account

    def __str__(self) -> str:
        return f"<Transaction - {self.account.person.name} | R${self.money:.2f}>"

    def to_json(self):
        return {
            "id": self.id,
            "money": self.money,
            "dateTime": self.date_time,
            "transactionType": self.transaction_type,
            "account": {
                "id": self.account.id,
                "name": self.account.person.name,
            },
            "originAccount": (
                {
                    "id": self.origin_account.id,
                    "name": self.origin_account.person.name,
                }
                if self.origin_account is not None
                else None
            ),
        }
