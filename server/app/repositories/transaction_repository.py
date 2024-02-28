from dataclasses import dataclass
from sqlalchemy import select, func
from app.db import db
from app.errors import InfraError
from app.models import Transaction


@dataclass
class TransactionRepository:
    def get_all(self, account_id: int) -> list[Transaction]:
        stmt = select(Transaction).where(Transaction.account_id == account_id)
        return [transaction[0] for transaction in db.session.execute(stmt).all()]

    def get_by_id(self, id: int) -> Transaction | None:
        return db.session.query(Transaction).get(id)

    def get_today_transactions(self, account_id: int) -> list[Transaction]:
        stmt = (
            select(Transaction)
            .where(Transaction.account_id == account_id)
            .where(func.date(Transaction.date_time) == func.current_date())
        )
        return [transaction[0] for transaction in db.session.execute(stmt).all()]

    def save(self, transaction: Transaction) -> Transaction:
        try:
            if transaction.id is None:
                db.session.add(transaction)
            db.session.commit()
            return transaction
        except Exception as err:
            db.session.rollback()
            raise InfraError("Houve um error ao salvar a transação.")

    def save_all(self, transactions: list[Transaction]):
        try:
            db.session.add_all(transactions)
            db.session.commit()
        except Exception as err:
            db.session.rollback()
            raise InfraError("Houve um error ao salvar as transações.")
