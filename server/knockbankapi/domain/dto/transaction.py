from typing import TypedDict
from datetime import date
from knockbankapi.domain.dto import PaginationQueryDTO


class TransactionQueryDTO(PaginationQueryDTO):
    pageSize: int
    pageIndex: int
    transactionDate: date
    transactionType: int


class TransactionResumeDTO(TypedDict):
    month: int
    label: str
    amount: float


class TransactionResumeBuilder:
    @staticmethod
    def build(data: list[TransactionResumeDTO]):
        months = {
            1: "Jan",
            2: "Fev",
            3: "Mar",
            4: "Abr",
            5: "Mai",
            6: "Jun",
            7: "Jul",
            8: "Ago",
            9: "Set",
            10: "Out",
            11: "Nov",
            12: "Dez",
        }
        this_year_transactions_resume: list[TransactionResumeDTO] = []

        for _, value in months.items():
            this_year_transactions_resume.append({"month": value, "label": "Entrada"})
            this_year_transactions_resume.append({"month": value, "label": "Saída"})

        for resume in data:
            for month_resume in this_year_transactions_resume:
                if months.get(resume.get("month")) == month_resume.get(
                    "month"
                ) and resume.get("label") == month_resume.get("label"):
                    month_resume["amount"] = resume.get("amount")
                elif month_resume.get("amount") is None:
                    month_resume["amount"] = 0

        return this_year_transactions_resume


class TransactionDTO(TypedDict):
    money: float
    accountId: int | None


class TransactionTransferDTO(TransactionDTO):
    senderAccountId: int
