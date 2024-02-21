from datetime import datetime as dt, timedelta
from dataclasses import dataclass, field
from app.security import JwtService
from app.models import Account, User
from app.repositories import AccountRepository, UserRepository
from app.errors import ForbiddenError


@dataclass
class AuthService:
    jwt_service: JwtService = field(default_factory=lambda: JwtService())
    user_repository: UserRepository = field(default_factory=lambda: UserRepository())
    account_repository: AccountRepository = field(
        default_factory=lambda: AccountRepository()
    )

    def login(self, cpf: str, password: str) -> str:
        account: Account = self.account_repository.get_by_cpf(cpf)

        print(account)
        if account is None or account.user.verify_password_hash(password) is False:
            raise ForbiddenError("Credenciais Inválidas.")

        initiated_at: dt = dt.utcnow()
        token_payload = {
            "iat": initiated_at,
            "exp": initiated_at + timedelta(days=1),
            "user_id": account.user.id,
        }

        token: str = self.jwt_service.encode_token(token_payload)
        account.user.token = token
        self.account_repository.save(account)

        return token

    def logout(self, user: User) -> None:
        user.token, user.refresh_token = None, None
        self.user_repository.save(user)
