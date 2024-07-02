from datetime import date
from dataclasses import dataclass
from sqlalchemy import select, func
from app.db import db
from app.errors import InfraError
from app.models import Transaction, TransactionType


@dataclass
class TransactionRepository:
    def get_all(
        self,
        account_id: int,
        transaction_type: TransactionType = None,
        date: date = None,
    ) -> list[Transaction]:
        query = (
            select(Transaction)
            .where(Transaction.account_id == account_id)
            .order_by(Transaction.id.desc())
        )

        if transaction_type is not None:
            query = query.where(
                Transaction.transaction_type == transaction_type.value[0]
            )

        if date is not None:
            query = query.where(func.date(Transaction.date_time) == date)

        transactions = db.session.execute(query).all()
        return [transaction[0] for transaction in transactions]

    def get_by_id(self, id: int) -> Transaction | None:
        return db.session.query(Transaction).get(id)

    def save(self, transaction: Transaction) -> Transaction:
        try:
            if transaction.id is None:
                db.session.add(transaction)
            db.session.commit()
            return transaction
        except Exception as err:
            print(err)
            db.session.rollback()
            raise InfraError("Houve um error ao salvar a transação.")

    def save_all(self, transactions: list[Transaction]):
        try:
            db.session.add_all(transactions)
            db.session.commit()
        except Exception as err:
            db.session.rollback()
            raise InfraError("Houve um error ao salvar as transações.")
