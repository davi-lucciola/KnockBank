from datetime import date
from app.models import BaseModel
from sqlalchemy.orm import Mapped, relationship
from sqlalchemy import Column, BigInteger, String, Date
import typing

if typing.TYPE_CHECKING:
    from models import Account


class Person(BaseModel):
    __tablename__ = "persons"

    id: int = Column(BigInteger, primary_key=True, autoincrement=True)
    cpf: str = Column(String(11), nullable=False, unique=True)
    name: str = Column(String(255), nullable=False)
    birth_date: date = Column(Date, nullable=False)

    account: Mapped["Account"] = relationship("Account", back_populates="person")

    def __init__(self, name: str, cpf: str, birth_date: date) -> None:
        self.name = name
        self.cpf = cpf
        self.birth_date = birth_date

    def __str__(self) -> str:
        return f"<Person - {self.name}>"
