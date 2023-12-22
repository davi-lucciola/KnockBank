from dataclasses import dataclass, field
from app.errors import NotFoundError, DomainError
from app.models import Conta
from app.repositories import ContaRepository, PessoaRepository


@dataclass
class ContaService:
    conta_repository: ContaRepository = field(default_factory=lambda: ContaRepository())
    pessoa_repository: PessoaRepository = field(default_factory=lambda: PessoaRepository())

    def buscar_pelo_id(self, conta_id: int) -> Conta:
        conta: Conta = self.conta_repository.buscar_pelo_id(conta_id)

        if conta is None:
            raise NotFoundError('Conta não encontrada.')
        
        return conta

    def cadastrar(self, conta: Conta) -> Conta:
        conta_cadastrada: Conta = self.conta_repository.buscar_pelo_cpf(conta.pessoa.cpf)

        if conta_cadastrada is not None:
            raise DomainError(f'Você já tem uma conta cadastrada.')
            
        return self.conta_repository.salvar(conta)