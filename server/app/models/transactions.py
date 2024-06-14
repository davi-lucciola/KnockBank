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

    id = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    date_time = mapped_column(DateTime, nullable=False, default=dt.now())
    money = mapped_column(Numeric(10, 2), nullable=False)
    transaction_type = mapped_column(Integer, nullable=False)

    account_id = mapped_column(
        BigInteger, ForeignKey("accounts.id"), nullable=False
    )
    account: Mapped["Account"] = relationship(
        "Account", foreign_keys=[account_id]
    )

    reciver_id = mapped_column(BigInteger, ForeignKey("accounts.id"))
    reciver: Mapped["Account"] = relationship(
        "Account", foreign_keys=[reciver_id]
    )

    def __init__(
        self,
        money: float,
        transaction_type: TransactionType,
        account: Account,
        reciver: Account = None,
    ) -> None:
        self.money = Decimal(money)
        self.transaction_type = transaction_type.value[0]
        self.account_id = account.id
        self.account = account
        self.reciver_id = reciver.id if reciver is not None else None
        self.reciver = reciver

    def __str__(self) -> str:
        return f"<Transaction - {self.account.person.name} | R${self.money:.2f}>"

    def to_json(self):
        return {
            "id": self.id,
            "money": self.money,
            "transaction_type": {
                "id": self.transaction_type,
                "description": TransactionType.get_transaction_type(
                    self.transaction_type
                ).value[1],
            },
            "sender": {
                "id": self.reciver.id,
                "name": self.account.person.name,
            },
            "reciver": {
                "id": self.reciver.id,
                "name": self.reciver.person.name,
            },
        }
