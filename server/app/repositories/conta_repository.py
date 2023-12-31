from dataclasses import dataclass
from app.database import db
from app.models import Conta, Pessoa
from app.errors import InfraError


@dataclass
class ContaRepository:
    def buscar_pelo_id(self, conta_id: int) -> Conta | None:
        return db.session.query(Conta).get(conta_id)
    
    def buscar_pelo_cpf(self, cpf: str) -> Conta | None:
        stmt = db.session.query(Conta)\
            .join(Pessoa, Conta.pessoa_id == Pessoa.id)\
            .where(Pessoa.cpf == cpf)
            
        conta: Conta = db.session.execute(stmt).first()
        return conta[0] if conta is not None else None

    def salvar(self, conta: Conta) -> Conta:
        try:
            if conta.id is None:
                db.session.add(conta)
            
            db.session.commit()
            return conta
        except Exception as err:
            db.session.rollback()
            raise InfraError('Houve um error ao salvar a conta.')