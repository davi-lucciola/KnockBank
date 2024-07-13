from typing import TypedDict
from datetime import date
from knockbankapi.domain.dto import PaginationQueryDTO


class AccountQueryDTO(PaginationQueryDTO):
    search: str


class UpdateAccountDTO(TypedDict):
    name: str
    birthDate: date
    accountType: int
    dailyWithdrawLimit: float


class CreateAccountDTO(UpdateAccountDTO):
    cpf: str
    password: str
