import logging
from app.db import db
from dataclasses import dataclass
from sqlalchemy import or_, select
from app.models import Account, Person
from app.errors import InfraError
from app.utils.types import TPaginationResponse, TAccountQuery
from app.utils.builders import PaginationBuilder


@dataclass
class AccountRepository:
    def get_all(
        self, filter: TAccountQuery, account_id: int = None
    ) -> TPaginationResponse[Account]:
        query = select(Account)

        if account_id is not None:
            query = query.where(Account.id != account_id)

        if filter.get("search") is not None:
            query = (
                query.join(Person, Person.id == Account.person_id)
                .where(Account.fl_active == True)
                .where(
                    or_(
                        Person.cpf.like(f"{filter.get('search')}%"),
                        Person.name.like(f"%{filter.get('search')}%"),
                    )
                )
            )

        data = db.paginate(
            query, page=filter.get("pageIndex"), per_page=filter.get("pageSize")
        )

        return PaginationBuilder.build(
            data.items,
            data.total,
            data.pages,
            filter.get("pageIndex"),
            filter.get("pageSize"),
        )

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
            logging.error(err)
            db.session.rollback()
            raise InfraError("Houve um error ao salvar a conta.")
