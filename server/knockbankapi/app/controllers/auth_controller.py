from apiflask import APIBlueprint
from knockbankapi.app.auth import auth
from knockbankapi.app.schemas import UserLogin
from knockbankapi.domain.dto import UserLoginDTO
from knockbankapi.domain.models import User
from knockbankapi.domain.services import AuthService


auth_bp = APIBlueprint("Auth", __name__)


@auth_bp.post("/login")
@auth_bp.input(UserLogin, arg_name="user_login_dto")
def login(user_login_dto: UserLoginDTO, auth_service: AuthService = AuthService()):
    """
    Endpoint para realização do login.\n
    Recebe o cpf do dono da conta e a senha de acesso.\n
    Retorna o token JWT.
    """
    token: str = auth_service.login(user_login_dto)
    return {"type": "bearer", "accessToken": token}


@auth_bp.delete("/logout")
@auth_bp.auth_required(auth)
def logout(auth_service: AuthService = AuthService()):
    """
    Endpoint para deslogar o usuário.\n
    Remove o token JWT do banco de dados
    """
    auth_user: User = auth.current_user
    auth_service.logout(auth_user)
    return {
        "message": "Conta desconectada com sucesso.",
        "detail": {"user": {"id": auth_user.id, "nome": auth_user.account.person.name}},
    }
