from datetime import date
from app.models import BaseModel
from sqlalchemy.orm import Mapped, relationship
from sqlalchemy import Column, BigInteger, String, Date
import typing

if typing.TYPE_CHECKING:
    from models import Conta


class Pessoa(BaseModel):
    __tablename__ = 'pessoa'

    id: int = Column(BigInteger, primary_key=True, autoincrement=True)
    cpf: str = Column(String(11), nullable=False, unique=True)
    nome: str = Column(String(255), nullable=False)
    data_nascimento: date = Column(Date, nullable=False)

    conta: Mapped['Conta'] = relationship('Conta', back_populates='pessoa')

    def __init__(self, nome: str, cpf: str, data_nascimento: date) -> None:
        self.nome = nome
        self.cpf = cpf
        self.data_nascimento = data_nascimento

    def __str__(self) -> str:
        return f'<Pessoa - {self.nome}>'