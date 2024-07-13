import logging
from dataclasses import dataclass
from knockbankapi.domain.errors import InfraError
from knockbankapi.domain.models import User
from knockbankapi.infra.db import db


@dataclass
class UserRepository:
    def get_by_id(self, id: int) -> User | None:
        return db.session.query(User).get(id)

    def get_by_token(self, token: str) -> User | None:
        return db.session.query(User).where(User.token == token).first()

    def save(self, user: User) -> User:
        try:
            if user.id is None:
                db.session.add(user)

            db.session.commit()
            return user
        except Exception as err:
            logging.error(err)
            db.session.rollback()
            raise InfraError("Houve um error ao salvar o usuario.")
