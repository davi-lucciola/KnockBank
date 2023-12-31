from apiflask import HTTPTokenAuth
from jose import ExpiredSignatureError, JWTError
from app.errors import UnauthorizedError
from app.models import User
from app.repositories import UserRepository
from app.security.jwt import JwtService


auth = HTTPTokenAuth(scheme='Bearer')

@auth.verify_token
def verify_token(
    token: str, 
    jwt_service: JwtService = JwtService(), 
    user_repository: UserRepository = UserRepository()
) -> User:
    user: User = user_repository.buscar_pelo_token(token)
    
    try:
        jwt_service.decode_token(token)
    except ExpiredSignatureError:
        user.token = None
        user_repository.salvar(user)
        raise UnauthorizedError('Token expirado.')
    except JWTError:
        raise UnauthorizedError('Token inválido.')
    
    return user