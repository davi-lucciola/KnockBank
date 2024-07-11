from typing import TypedDict
from datetime import date
from app.utils.types import TPaginationQuery


class TAccountQuery(TPaginationQuery):
    search: str


class TBaseAccount(TypedDict):
    name: str
    birthDate: date
    accountType: int
    dailyWithdrawLimit: float


class TAccount(TBaseAccount):
    cpf: str
    password: str
