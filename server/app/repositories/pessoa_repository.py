from dataclasses import dataclass
from app.database import db
from app.models import Pessoa


@dataclass
class PessoaRepository:
    def buscar_pelo_cpf(self, cpf: str) -> Pessoa | None:
        return db.session.query(Pessoa).filter(Pessoa.cpf == cpf).first()