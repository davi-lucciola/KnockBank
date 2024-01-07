from apiflask import APIBlueprint
from app.security import auth
from app.schemas import UserLogin
from app.models import User
from app.services import AuthService


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


@auth_bp.delete('/logout')
@auth_bp.auth_required(auth)
def logout(auth_service: AuthService = AuthService()):
    auth_user: User = auth.current_user
    auth_service.logout(auth_user)
    return {
        'message': 'Conta desconectada com sucesso.',
        'detail': {
            'user': {
                'id': auth_user.id,
                'nome': auth_user.conta.pessoa.nome
            }
        }
    }