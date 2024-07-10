from app.db import db
from datetime import date
from decimal import Decimal
from dataclasses import dataclass
from sqlalchemy import text, select, func
from app.errors import InfraError
from app.models import Transaction, TransactionType
from app.schemas import TTransactionMonthResume, TTransactionQuery, PaginationBuilder


@dataclass
class TransactionRepository:
    def get_all(
        self,
        filter: TTransactionQuery,
        account_id: int,
    ):
        query = (
            select(Transaction)
            .where(Transaction.account_id == account_id)
            .order_by(Transaction.id.desc())
        )

        if filter.get("transactionType") is not None:
            query = query.where(
                Transaction.transaction_type == filter.get("transactionType")
            )

        if filter.get("transactionDate") is not None:
            query = query.where(
                func.date(Transaction.date_time) == filter.get("transactionDate")
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

    def get_total_today_withdraw(self, account_id: int) -> Decimal:
        return (
            db.session.query(func.sum(Transaction.money))
            .where(Transaction.account_id == account_id)
            .where(func.date(Transaction.date_time) == (date.today()))
            .where(Transaction.transaction_type == TransactionType.WITHDRAW.value[0])
            .first()[0]
        )

    def get_this_year_transactions(
        self, account_id: int
    ) -> list[TTransactionMonthResume]:
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
