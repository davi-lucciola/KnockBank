from knockbankapi.domain.dto import (
    TransactionDTO,
    TransactionQueryDTO,
    TransactionTransferDTO,
)


def transaction_dto():
    return TransactionDTO(money=800)


def transaction_transfer_dto():
    # accountId from "Tester2"
    return TransactionTransferDTO(money=800, accountId=2)


def transaction_query_dto():
    return TransactionQueryDTO(pageIndex=1, pageSize=10)
