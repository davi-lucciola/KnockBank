from dataclasses import dataclass
from sqlalchemy import or_, select
from app.db import db
from app.models import Account, Person
from app.errors import InfraError
from app.schemas import AccountFilter


@dataclass
class AccountRepository:
    def get_all(self, filter: AccountFilter, account_id: int):
        stmt = select(Account).where(Account.id != account_id)

        if filter.get("search") is not None:
            stmt = (
                stmt.join(Person, Person.id == Account.person_id)
                .where(Account.fl_active == True)
                .where(
                    or_(
                        Person.cpf.like(f"{filter.get('search')}%"),
                        Person.name.like(f"%{filter.get('search')}%"),
                    )
                )
            )

        stmt = stmt.offset(filter.get('offset')).limit(filter.get('limit'))
        return [account[0] for account in db.session.execute(stmt).all()]

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
