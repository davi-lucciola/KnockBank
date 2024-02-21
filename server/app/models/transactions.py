from enum import Enum
from datetime import datetime as dt
from decimal import Decimal
from sqlalchemy import Column, Integer, BigInteger, DateTime, Numeric, ForeignKey
from sqlalchemy.orm import Mapped, relationship
from app.models import BaseModel, Account


class TransactionType(Enum):
    DEPOSIT = (1, "Depósito")
    WITHDRAW = (2, "Saque")
    TRANSFER = (3, "Transferência")

    @classmethod
    def get_transaction_type(cls, transaction_type_id: int):
        for transaction_type in cls:
            if transaction_type.value[0] == transaction_type_id:
                return transaction_type

        raise ValueError("Tipo de Transação Inválida.")


class Transaction(BaseModel):
    __tablename__ = "transactions"

    id: int = Column(BigInteger, primary_key=True, autoincrement=True)
    date_time: dt = Column(DateTime, nullable=False, default=dt.now())
    value: Decimal = Column(Numeric(10, 2), nullable=False)
    transaction_type: int = Column(Integer, nullable=False)

    account_id: int = Column(BigInteger, ForeignKey("accounts.id"), nullable=False)
    account: Mapped["Account"] = relationship("Account", back_populates="transactions")

    def __init__(
        self, value: float, account: Account, transaction_type: TransactionType
    ) -> None:
        self.value = Decimal(value)
        self.account_id = account.id
        self.account = account
        self.transaction_type = transaction_type.value[0]

    def to_json(self):
        return {
            "id": self.id,
            "value": self.value,
            "transaction_type": {
                "id": self.transaction_type,
                "description": TransactionType.get_transaction_type(
                    self.transaction_type
                ).value[1],
            },
        }
