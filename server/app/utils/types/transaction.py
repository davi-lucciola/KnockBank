from typing import TypedDict
from datetime import date
from app.utils.types import TPaginationQuery


class TTransactionQuery(TPaginationQuery):
    pageSize: int
    pageIndex: int
    transactionDate: date
    transactionType: int


class TTransactionMonthResume(TypedDict):
    month: int
    label: str
    amount: float
