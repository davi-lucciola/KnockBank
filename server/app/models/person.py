from datetime import date
from app.models import BaseModel
from sqlalchemy.orm import Mapped, relationship, mapped_column
from sqlalchemy import BigInteger, String, Date
import typing

if typing.TYPE_CHECKING:
    from app.models import Account


class Person(BaseModel):
    __tablename__ = "persons"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    cpf: Mapped[str] = mapped_column(String(11), nullable=False, unique=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    birth_date: Mapped[date] = mapped_column(Date, nullable=False)

    account: Mapped["Account"] = relationship("Account", back_populates="person")

    def __str__(self) -> str:
        return f"<Person - {self.name}>"

    def __init__(self, name: str, cpf: str, birth_date: date) -> None:
        self.name = name
        self.cpf = cpf
        self.birth_date = birth_date
