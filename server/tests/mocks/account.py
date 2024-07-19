from knockbankapi.domain.dto import CreateAccountDTO, UpdateAccountDTO


def create_account_dto():
    return CreateAccountDTO(
        name="Davi",
        cpf="58901211033",
        accountType=1,
        birthDate="2004-01-14",
        password="Test#1234",
        dailyWithdrawLimit=1000,
    )


def update_account_dto():
    return UpdateAccountDTO(
        name="Novo Nome", birthDate="2000-01-23", accountType=2, dailyWithdrawLimit=2000
    )
