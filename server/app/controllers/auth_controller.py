from apiflask import APIBlueprint
from app.security import auth
from app.schemas import UserLogin
from app.models import User
from app.services import AuthService


auth_bp = APIBlueprint("Auth", __name__)


@auth_bp.post("/login")
@auth_bp.input(UserLogin, arg_name="user_payload")
def login(user_payload: dict, auth_service: AuthService = AuthService()):
    """
    Endpoint para realização do login.\n
    Recebe o cpf do dono da conta e a senha de acesso.\n
    Retorna o token JWT.
    """
    token: str = auth_service.login(
        user_payload.get("cpf"), user_payload.get("password")
    )
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
