from datetime import date
from dataclasses import dataclass
from sqlalchemy import text, select, func
from app.db import db
from app.errors import InfraError
from app.models import Transaction, TransactionType
from app.schemas import TransactionMonthResumeDict


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

    def get_this_year_transactions(
        self, account_id: int
    ) -> list[TransactionMonthResumeDict]:
        query = text(
            """
            SELECT
                MONTH(t.date_time) as month,
                (CASE WHEN t.transaction_type = 1 
                    THEN 'Entrada'
                    ELSE 'Saída' 
                END) as label,
                SUM(ABS(t.money)) as amount
            FROM 
                transactions t
            WHERE 
                t.account_id = :account_id
                AND YEAR(t.date_time) = YEAR(CURRENT_TIMESTAMP())
            GROUP BY 
                label, month
            ORDER BY 
                month, label
        """
        )

        data = db.session.execute(query, {"account_id": account_id}).all()

        return [{"month": row[0], "label": row[1], "amount": row[2]} for row in data]

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
