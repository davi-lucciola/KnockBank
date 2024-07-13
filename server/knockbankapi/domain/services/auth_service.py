from dataclasses import dataclass, field
from datetime import datetime as dt, timedelta
from knockbankapi.domain.errors import ForbiddenError
from knockbankapi.domain.dto import UserLoginDTO
from knockbankapi.domain.models import Account, User
from knockbankapi.infra.utils import JwtService
from knockbankapi.infra.repositories import AccountRepository, UserRepository


@dataclass
class AuthService:
    jwt_service: JwtService = field(default_factory=lambda: JwtService())
    user_repository: UserRepository = field(default_factory=lambda: UserRepository())
    account_repository: AccountRepository = field(
        default_factory=lambda: AccountRepository()
    )

    def login(self, user_login_dto: UserLoginDTO) -> str:
        account: Account = self.account_repository.get_by_cpf(user_login_dto["cpf"])

        if (
            account is None
            or account.user.verify_password_hash(user_login_dto["password"]) is False
        ):
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
