from enum import Enum
from decimal import Decimal
from datetime import date
from app.models import BaseModel
from sqlalchemy.orm import Mapped, relationship
from sqlalchemy import Column, BigInteger, ForeignKey, Integer, Numeric, Boolean
from app.models import Pessoa, User


class TipoConta(Enum):
    CONTA_CORRENTE = (1, 'Conta Corrente')
    CONTA_POUPANCA = (2, 'Conta Poupança')
    CONTA_SALARIO = (3, 'Conta Salário')
    CONTA_PAGAMENTO = (4, 'Conta Pagamento')

    @classmethod
    def buscar_tipo_conta(cls, tipo_conta_id: int):
        for tipo_conta in cls:
            if tipo_conta.value[0] == tipo_conta_id:
                return tipo_conta
        
        raise ValueError('Tipo de Conta Inválido')

class Conta(BaseModel):
    id: int = Column(BigInteger, primary_key=True, autoincrement=True)
    saldo: Decimal = Column(Numeric(10, 2), nullable=False, default=Decimal(0))
    fl_ativo: bool = Column(Boolean, nullable=False, default=True)
    tipo_conta: int = Column(Integer, nullable=False)
    limite_saque_diario: Decimal = Column(Numeric(10, 2), nullable=False, default=Decimal(999))

    pessoa_id: int = Column(BigInteger, ForeignKey('pessoa.id'), nullable=False, unique=True)
    pessoa: Mapped['Pessoa'] = relationship('Pessoa', back_populates='conta')

    user_id: int = Column(BigInteger, ForeignKey('users.id'), nullable=False, unique=True)
    user: Mapped['User'] = relationship('User', back_populates='conta')

    def __init__(self, nome: str, cpf: str, data_nascimento: date, senha: str, tipo_conta: int, limite_saque_diario: float = 999) -> None:
        self.pessoa = Pessoa(nome, cpf, data_nascimento)
        self.user = User(senha)
        self.tipo_conta = tipo_conta
        self.saldo = 0
        self.limite_saque_diario = limite_saque_diario
        self.fl_ativo = True

    def to_json(self) -> dict:
        return {
            'id': self.id,
            'saldo': self.saldo,
            'fl_ativo': self.fl_ativo,
            'pessoa': {
                'id': self.pessoa.id,
                'nome': self.pessoa.nome,
                'cpf': self.pessoa.cpf,
                'data_nascimento': self.pessoa.data_nascimento.isoformat()
            },
            'tipo_conta': {
                'id': TipoConta.buscar_tipo_conta(self.tipo_conta).value[0],
                'descricao': TipoConta.buscar_tipo_conta(self.tipo_conta).value[1]
            },
            'limite_saque_diario': self.limite_saque_diario,
        } 

    def __str__(self) -> str:
        return f'<Conta - {self.pessoa.nome}/{self.id}>'
