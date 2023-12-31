from dataclasses import dataclass, field
from app.errors import NotFoundError, DomainError
from app.models import Conta
from app.repositories import ContaRepository


@dataclass
class ContaService:
    conta_repository: ContaRepository = field(default_factory=lambda: ContaRepository())

    def buscar_pelo_id(self, conta_id: int) -> Conta:
        conta: Conta = self.conta_repository.buscar_pelo_id(conta_id)

        if conta is None:
            raise NotFoundError('Conta não encontrada.')
        
        return conta

    def cadastrar(self, conta: Conta) -> Conta:
        conta_cadastrada: Conta = self.conta_repository.buscar_pelo_cpf(conta.pessoa.cpf)
        
        if conta_cadastrada is not None:
            raise DomainError(f'Esse CPF já tem uma conta cadastrada.')

        try:
            conta.user.validar_senha(conta.user.senha)
        except ValueError as err:
            raise DomainError(err.args[0])
        
        conta.user.gerar_hash_senha()

        return self.conta_repository.salvar(conta)
