from enum import Enum
from decimal import Decimal
from datetime import date
from sqlalchemy import (
    CheckConstraint,
    BigInteger,
    ForeignKey,
    Integer,
    Numeric,
    Boolean,
)
from sqlalchemy.orm import Mapped, relationship, mapped_column
from app.models import BaseModel, Person, User
import typing

if typing.TYPE_CHECKING:
    from app.models import Transaction


class AccountType(Enum):
    CURRENT_ACCOUNT = (1, "Conta Corrente")
    SAVING_ACCOUNT = (2, "Conta Poupança")
    SALARY_ACCOUNT = (3, "Conta Salário")
    PAYMENT_ACCOUNT = (4, "Conta Pagamento")

    @classmethod
    def get_account_type(cls, account_type_id: int):
        for account_type in cls:
            if account_type.value[0] == account_type_id:
                return account_type

        raise ValueError("Tipo de Conta Inválida.")


class Account(BaseModel):
    __tablename__ = "accounts"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    balance: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        CheckConstraint("balance > 0"),
        nullable=False,
        default=Decimal(0),
    )
    fl_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    account_type: Mapped[int] = mapped_column(Integer, nullable=False)
    daily_withdrawal_limit: Mapped[Decimal] = mapped_column(
        Numeric(10, 2), nullable=False, default=Decimal(999)
    )

    person_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("persons.id"), nullable=False, unique=True
    )
    person: Mapped["Person"] = relationship("Person", back_populates="account")

    user_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("users.id"), nullable=False, unique=True
    )
    user: Mapped["User"] = relationship("User", back_populates="account")

    def __init__(
        self,
        name: str,
        cpf: str,
        birth_date: date,
        password: str,
        account_type: int,
        daily_withdrawal_limit: float = 999,
    ) -> None:
        self.person = Person(name, cpf, birth_date)
        self.user = User(password)
        self.account_type = account_type
        self.balance = 0
        self.daily_withdrawal_limit = daily_withdrawal_limit
        self.fl_active = True

    def __str__(self) -> str:
        return f"<Account - {self.person.name} | {self.id}>"

    def to_json(self) -> dict:
        return {
            "id": self.id,
            "balance": self.balance,
            "flActive": self.fl_active,
            "person": {
                "id": self.person.id,
                "name": self.person.name,
                "cpf": self.person.cpf,
                "birthDate": self.person.birth_date,
            },
            "accountType": self.account_type,
            "dailyWithdrawLimit": self.daily_withdrawal_limit,
        }
