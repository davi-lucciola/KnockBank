from knockbankapi.domain.dto import CreateAccountDTO


def create_account_dto():
    return CreateAccountDTO(
        name="Davi",
        cpf="58901211033",
        accountType=1,
        birthDate="2004-01-14",
        password="Test#1234",
        dailyWithdrawLimit=1000,
    )
