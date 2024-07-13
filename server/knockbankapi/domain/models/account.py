from enum import Enum
from decimal import Decimal
from datetime import date
from sqlalchemy import (
    CheckConstraint,
    ForeignKey,
    Integer,
    Numeric,
    Boolean,
)
from sqlalchemy.orm import Mapped, relationship, mapped_column
from knockbankapi.domain.dto import UpdateAccountDTO
from knockbankapi.domain.models import BaseModel, BigIntegerPK, Person, User


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

    id: Mapped[int] = mapped_column(BigIntegerPK, primary_key=True, autoincrement=True)
    balance: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        CheckConstraint("balance >= 0"),
        nullable=False,
        default=Decimal(0),
    )
    fl_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    account_type: Mapped[int] = mapped_column(Integer, nullable=False)
    daily_withdraw_limit: Mapped[Decimal] = mapped_column(
        Numeric(10, 2), nullable=False, default=Decimal(999)
    )

    person_id: Mapped[int] = mapped_column(
        BigIntegerPK, ForeignKey("persons.id"), nullable=False, unique=True
    )
    person: Mapped["Person"] = relationship("Person", back_populates="account")

    user_id: Mapped[int] = mapped_column(
        BigIntegerPK, ForeignKey("users.id"), nullable=False, unique=True
    )
    user: Mapped["User"] = relationship("User", back_populates="account")

    def __init__(
        self,
        name: str,
        cpf: str,
        birthDate: date,
        password: str,
        accountType: int,
        dailyWithdrawLimit: float = 999,
    ) -> None:
        self.person = Person(name, cpf, birthDate)
        self.user = User(password)
        self.account_type = accountType
        self.balance = 0
        self.daily_withdraw_limit = dailyWithdrawLimit
        self.fl_active = True

    def __str__(self) -> str:
        return f"<Account - {self.person.name} | {self.id}>"

    def update(self, data: UpdateAccountDTO) -> None:
        self.person.name = data["name"]
        self.person.birth_date = data["birthDate"]
        self.account_type = data["accountType"]
        self.daily_withdraw_limit = data["dailyWithdrawLimit"]

    def to_json(self, mask_cpf: bool = False) -> dict:
        return {
            "id": self.id,
            "balance": self.balance,
            "flActive": self.fl_active,
            "person": {
                "id": self.person.id,
                "name": self.person.name,
                "cpf": (
                    self.person.cpf
                    if mask_cpf is False
                    else "***."
                    + self.person.cpf[3:6]
                    + "."
                    + self.person.cpf[6:9]
                    + "-**"
                ),
                "birthDate": self.person.birth_date,
            },
            "accountType": self.account_type,
            "dailyWithdrawLimit": float(self.daily_withdraw_limit),
        }
