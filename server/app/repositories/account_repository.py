from dataclasses import dataclass

from sqlalchemy import select
from app.db import db
from app.models import Account, Person
from app.errors import InfraError


@dataclass
class AccountRepository:
    def get_by_id(self, id: int) -> Account | None:
        return db.session.query(Account).get(id)

    def get_by_cpf(self, cpf: str) -> Account | None:
        account: Account = (
            db.session.query(Account)
            .join(Person, Account.person_id == Person.id)
            .where(Person.cpf == cpf)
            .first()
        )
        return account

    def save(self, account: Account) -> Account:
        try:
            if account.id is None:
                db.session.add(account)

            db.session.commit()
            return account
        except Exception as err:
            db.session.rollback()
            raise InfraError("Houve um error ao salvar a conta.")
