from apiflask import Schema
from app.schemas import PersonOut
from datetime import date
from typing import TypedDict
from pycpfcnpj import cpfcnpj
from apiflask.fields import Integer, String, Date, Float, Boolean, Dict, Nested
from apiflask.validators import OneOf, Range
from marshmallow import validates, ValidationError
from string import ascii_lowercase, ascii_uppercase, digits, punctuation


class AccountIn(Schema):
    name: str = String(required=True)
    cpf: str = String(required=True)
    birth_date: date = Date(required=True)
    password: str = String(required=True)
    account_type: int = Integer(
        required=True,
        validate=[
            OneOf([1, 2, 3, 4], error="Tipo de Conta Inválida. Deve ser 1, 2, 3 ou 4.")
        ],
    )
    daily_withdrawal_limit: float = Float(
        required=False, validate=[Range(min=0)], default=999
    )

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
                raise ValidationError("A senha deve conter carácteres especiais.")


class AccountQuery(Schema):
    search: str = String()


class AccountFilter(TypedDict):
    search: str


class AccountOut(Schema):
    id: int = Integer()
    fl_active: bool = Boolean()
    person: dict = Nested(PersonOut)


class AccountMe(AccountOut):
    balance: float = Float()
    account_type: dict = Dict()
    daily_withdrawal_limit: float = Float()
