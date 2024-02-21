from datetime import date
from apiflask import Schema
from pycpfcnpj import cpfcnpj
from apiflask.fields import Integer, String, Date, Float, Boolean, Dict
from apiflask.validators import OneOf, Length, Range
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
        print(cpfcnpj.validate(cpf))
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


class AccountOut(Schema):
    id: int = Integer()
    saldo: float = Float()
    fl_ativo: bool = Boolean()
    pessoa: dict = Dict()
    tipo_Account: dict = Dict()
    limite_saque_diario: float = Float()
