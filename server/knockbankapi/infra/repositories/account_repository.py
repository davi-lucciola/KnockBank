import logging
from dataclasses import dataclass
from sqlalchemy import or_, select
from knockbankapi.domain.errors import InfraError
from knockbankapi.domain.dto import (
    PaginationBuilder,
    PaginationResponseDTO,
    AccountQueryDTO,
)
from knockbankapi.domain.models import Account, Person
from knockbankapi.infra.db import db


@dataclass
class AccountRepository:
    def get_all(
        self, filter: AccountQueryDTO, account_id: int = None
    ) -> PaginationResponseDTO[Account]:
        query = select(Account)

        if account_id is not None:
            query = query.where(Account.id != account_id)

        if filter.get("search") is not None:
            query = (
                query.join(Person, Person.id == Account.person_id)
                .where(Account.fl_active == True)
                .where(
                    or_(
                        Person.cpf.like(f"{filter['search']}%"),
                        Person.name.like(f"%{filter['search']}%"),
                    )
                )
            )

        data = db.paginate(query, page=filter["pageIndex"], per_page=filter["pageSize"])

        return PaginationBuilder.build(
            data.items,
            data.total,
            data.pages,
            filter["pageIndex"],
            filter["pageSize"],
        )

    def get_by_id(self, id: int) -> Account | None:
        return db.session.get(Account, id)

    def get_by_cpf(self, cpf: str, active: bool = None) -> Account | None:
        query = (
            db.session.query(Account)
            .join(Person, Account.person_id == Person.id)
            .where(Person.cpf == cpf)
        )

        if active is not None:
            query = query.where(Account.fl_active == active)

        return query.first()

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
