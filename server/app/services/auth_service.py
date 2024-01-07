from datetime import datetime as dt, timedelta
from dataclasses import dataclass, field
from app.security import JwtService
from app.models import Conta, User
from app.repositories import ContaRepository, UserRepository
from app.errors import NotFoundError, ForbiddenError


@dataclass
class AuthService:
    jwt_service: JwtService = field(default_factory=lambda: JwtService())
    user_repository: UserRepository = field(default_factory=lambda: UserRepository())
    conta_repository: ContaRepository = field(default_factory=lambda: ContaRepository())
    
    def login(self, cpf: str, senha: str) -> str:
        conta: Conta = self.conta_repository.buscar_pelo_cpf(cpf)

        if conta is None:
            raise NotFoundError('Conta não encontrada.')
        
        if conta.user.verificar_hash_senha(senha) is False:
            raise ForbiddenError('Credenciais Inválidas.')
        
        initiated_at: dt  = dt.utcnow()
        token_payload = {
            'iat': initiated_at,
            'exp': initiated_at + timedelta(days=1),
            'conta_id': conta.user.id 
        }

        token: str = self.jwt_service.encode_token(token_payload)
        conta.user.token = token
        self.conta_repository.salvar(conta)

        return token
    
    def logout(self, user: User) -> None:
        user.token, user.refresh_token = None, None
        self.user_repository.salvar(user)
