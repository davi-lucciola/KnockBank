from dataclasses import dataclass
from app.database import db
from app.models import User
from app.errors import InfraError


@dataclass
class UserRepository:
    def buscar_pelo_id(self, id: int) -> User | None:
        return db.session.query(User).filter(User.id == id).first()

    def buscar_pelo_token(self, token: str) -> User | None:
        return db.session.query(User).filter(User.token == token).first()

    def salvar(self, user: User) -> User:
        try:
            if user.id is None:
                db.session.add(user)
            
            db.session.commit()
            return user
        except Exception as err:
            db.session.rollback()
            raise InfraError('Houve um error ao salvar o usuario.')