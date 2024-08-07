from datetime import date
from pycpfcnpj import cpfcnpj
from apiflask import Schema
from apiflask.fields import Integer, String, Date, Float, Boolean, Nested, List
from apiflask.validators import OneOf, Range
from marshmallow import validates, ValidationError
from string import ascii_lowercase, ascii_uppercase, digits, punctuation
from knockbankapi.app.schemas import (
    PaginationQuery,
    PaginationResponse,
    PersonOut,
    PersonBasic,
)


class BaseAccount(Schema):
    name: str = String(required=True)
    birthDate: date = Date(required=True)
    accountType: int = Integer(
        required=True,
        validate=[
            OneOf([1, 2, 3, 4], error="Tipo de Conta Inválida. Deve ser 1, 2, 3 ou 4.")
        ],
    )
    dailyWithdrawLimit: float = Float(
        required=False,
        validate=[Range(min=0, error="O limite de saque diário deve maior que zero.")],
        load_default=999,
    )


class AccountIn(BaseAccount):
    cpf: str = String(required=True)
    password: str = String(required=True)

    @validates("cpf")
    def validate_cpf(self, cpf: str, **kwargs):
        if cpfcnpj.validate(cpf) is False:
            raise ValidationError("Cpf inválido.")

    @validates("password")
    def validate_password(self, password: str, **kwargs) -> None:
        if len(password) < 8:
            raise ValidationError("A senha deve conter no minímo 8 caracteres.")

        have_lower = have_upper = have_digits = have_special = False
        for char in password:
            if char in ascii_lowercase:
                have_lower = True

            if char in ascii_uppercase:
                have_upper = True

            if char in digits:
                have_digits = True

            if char in punctuation:
                have_special = True

            if have_upper and have_digits and have_lower and have_special:
                break

        else:
            if have_lower is False:
                raise ValidationError("A senha deve conter letras minúsculas.")

            if have_upper is False:
                raise ValidationError("A senha deve conter letras maiúsculas.")

            if have_digits is False:
                raise ValidationError("A senha deve conter numeros.")

            if have_special is False:
                raise ValidationError("A senha deve conter caracteres especiais.")


class AccountQuery(PaginationQuery):
    search: str = String()


class AccountOut(Schema):
    id: int = Integer()
    flActive: bool = Boolean()
    person: dict = Nested(PersonBasic)


class PaginationAccountOut(PaginationResponse):
    data = List(Nested(AccountOut))


class AccountMe(AccountOut):
    person: dict = Nested(PersonOut)
    balance: float = Float()
    accountType: int = Integer()
    dailyWithdrawLimit: float = Float()
    todayWithdraw: float = Float()
