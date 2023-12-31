from apiflask import APIBlueprint
from app.security import auth
from app.schemas import UserLogin
from app.services.auth_service import AuthService


auth_bp = APIBlueprint('Auth', __name__)


@auth_bp.post('/login')
@auth_bp.input(UserLogin, arg_name='user_payload')
def login(user_payload: dict, auth_service: AuthService = AuthService()):
    ''' 
    Endpoint para realização do login. 
    Recebe o cpf do dono da conta e a senha de acesso.
    Retorna o token JWT.
    '''
    token: str = auth_service.login(user_payload.get('cpf'), user_payload.get('senha'))
    return {
        'type': 'bearer',
        'access_token': token
    }