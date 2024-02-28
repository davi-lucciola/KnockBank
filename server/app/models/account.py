from enum import Enum
from decimal import Decimal
from datetime import date
from sqlalchemy import Column, BigInteger, ForeignKey, Integer, Numeric, Boolean
from sqlalchemy.orm import Mapped, relationship
from app.models import BaseModel, Person, User
import typing

if typing.TYPE_CHECKING:
    from models import Transaction


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

    id: int = Column(BigInteger, primary_key=True, autoincrement=True)
    balance: Decimal = Column(Numeric(10, 2), nullable=False, default=Decimal(0))
    fl_active: bool = Column(Boolean, nullable=False, default=True)
    account_type: str = Column(Integer, nullable=False)
    daily_withdrawal_limit: Decimal = Column(
        Numeric(10, 2), nullable=False, default=Decimal(999)
    )

    person_id: int = Column(
        BigInteger, ForeignKey("persons.id"), nullable=False, unique=True
    )
    person: Mapped["Person"] = relationship("Person", back_populates="account")

    user_id: int = Column(
        BigInteger, ForeignKey("users.id"), nullable=False, unique=True
    )
    user: Mapped["User"] = relationship("User", back_populates="account")

    transactions: Mapped[list["Transaction"]] = relationship(
        "Transaction", back_populates="account"
    )

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
            "saldo": self.balance,
            "fl_ativo": self.fl_active,
            "pessoa": {
                "id": self.person.id,
                "nome": self.person.name,
                "cpf": self.person.cpf,
                "data_nascimento": self.person.birth_date.isoformat(),
            },
            "tipo_conta": {
                "id": AccountType.get_account_type(self.account_type).value[0],
                "descricao": AccountType.get_account_type(self.account_type).value[1],
            },
            "limite_saque_diario": self.daily_withdrawal_limit,
        }
